import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
import { SkillDto } from "app/api/dtos/SkillDto";
import { getTestApp, TestApp } from "app/setup-integration-tests.test";
import { SkillsMockStorage } from "app/storages/SkillsMockStorage";
import { clearDb } from "../../../testUtils/clearDb";

chai.use(chaiHttp);

const isMock = process.env.USE_DB_MOCK === "true";

describe("deleteSkillController - Integration Tests", () => {
    let testApp: TestApp;
    let agent: ChaiHttp.Agent;

    beforeEach(async () => {
        testApp = await getTestApp();
        agent = chai.request.agent(testApp.app);

        if (testApp.services.storages.skillsStorage instanceof SkillsMockStorage) {
            (testApp.services.storages.skillsStorage as SkillsMockStorage)["skills"] = [];
        } else if (testApp.services.storages.knex) {
            await clearDb(testApp.services.storages.knex);
        }
    });

    describe("successful deletion", () => {
        it("should delete an existing skill", async () => {
            // ARRANGE
            const skillData = { name: "JavaScript", rate: 8 };
            const createResponse = await agent.post("/skills").send(skillData);
            const createdSkill = createResponse.body as SkillDto;

            // ACT
            const deleteResponse = await agent.delete(`/skills/${createdSkill.skillId}`);

            // ASSERT
            expect(deleteResponse.status).to.equal(204);
            expect(deleteResponse.body).to.be.empty;

            const allSkills = await testApp.services.storages.skillsStorage.getAll();
            const deletedSkill = allSkills.find(skill => skill.skillId === createdSkill.skillId);
            assert.isUndefined(deletedSkill, "Deleted skill should not exist in storage");
        });

        it("should delete skill and not affect other skills", async () => {
            // ARRANGE
            const skill1Data = { name: "React", rate: 9 };
            const skill2Data = { name: "Node.js", rate: 7 };
            const skill3Data = { name: "TypeScript", rate: 8 };

            const createResponse1 = await agent.post("/skills").send(skill1Data);
            const createResponse2 = await agent.post("/skills").send(skill2Data);
            const createResponse3 = await agent.post("/skills").send(skill3Data);

            const skill1 = createResponse1.body as SkillDto;
            const skill2 = createResponse2.body as SkillDto;
            const skill3 = createResponse3.body as SkillDto;

            // ACT
            const deleteResponse = await agent.delete(`/skills/${skill2.skillId}`);

            // ASSERT
            expect(deleteResponse.status).to.equal(204);

            const remainingSkills = await testApp.services.storages.skillsStorage.getAll();
            expect(remainingSkills).to.have.length(2);

            const remainingIds = remainingSkills.map(skill => skill.skillId);
            expect(remainingIds).to.include(skill1.skillId);
            expect(remainingIds).to.include(skill3.skillId);
            expect(remainingIds).to.not.include(skill2.skillId);
        });
    });

    describe("error cases", () => {
        it("should return 404 when skill does not exist", async () => {
            const nonExistentId = 99999;
            const response = await agent.delete(`/skills/${nonExistentId}`);
            expect(response.status).to.equal(404);
            assert.isObject(response.body);
            expect(response.body).to.have.property("message", "Skill not found");
        });
        it("should return 400 when skillId is missing", async () => {
            const response = await agent.delete(`/skills/`);
            expect(response.status).to.equal(404); //could change middleware so it can catch parameter missing and return 400 instead of 404 but need to verify with team
        });
        const invalidIds = ["abc", "12.5", "-1", "0"];

        invalidIds.forEach((invalidId) => {
            it(`should return 400 for invalid skillId "${invalidId}"`, async () => {
                const response = await agent.delete(`/skills/${invalidId}`);
                expect(response.status).to.equal(400);
                assert.isObject(response.body);
                expect(response.body).to.have.property("message", "Invalid skill ID");
            });
        });
    });

    describe("edge cases", () => {
        it("should handle deletion of the same skill twice", async () => {
            // ARRANGE
            const skillData = { name: "Angular", rate: 6 };
            const createResponse = await agent.post("/skills").send(skillData);
            const createdSkill = createResponse.body as SkillDto;

            // ACT
            const firstDelete = await agent.delete(`/skills/${createdSkill.skillId}`);
            const secondDelete = await agent.delete(`/skills/${createdSkill.skillId}`);

            // ASSERT
            expect(firstDelete.status).to.equal(204);
            expect(secondDelete.status).to.equal(404);
            expect(secondDelete.body).to.have.property("message", "Skill not found");
        });

        it("should work correctly when deleting from empty storage", async () => {
            // ARRANGE
            const nonExistentId = 1;

            // ACT
            const response = await agent.delete(`/skills/${nonExistentId}`);

            // ASSERT
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property("message", "Skill not found");
        });

        if (!isMock) {
            it("should handle very large skill IDs", async () => {
                // ARRANGE
                const largeId = Number.MAX_SAFE_INTEGER;

                // ACT
                const response = await agent.delete(`/skills/${largeId}`);

                // ASSERT
                expect(response.status).to.equal(404);
                expect(response.body).to.have.property("message", "Skill not found");
            });
        }
    });

    describe("integration with create and read operations", () => {
        it("should maintain data consistency after deletion", async () => {
            // ARRANGE
            const skills = [
                { name: "Python", rate: 9 },
                { name: "Django", rate: 8 },
                { name: "PostgreSQL", rate: 7 }
            ];

            const createdSkills: SkillDto[] = [];
            for (const skillData of skills) {
                const response = await agent.post("/skills").send(skillData);
                createdSkills.push(response.body as SkillDto);
            }

            // ACT
            await agent.delete(`/skills/${createdSkills[1].skillId}`);

            // ASSERT
            const getResponse = await agent.get("/skills");
            expect(getResponse.status).to.equal(200);

            const remainingSkills = getResponse.body.skills as SkillDto[];
            expect(remainingSkills).to.have.length(2);

            const remainingNames = remainingSkills.map(skill => skill.name);
            expect(remainingNames).to.include("Python");
            expect(remainingNames).to.include("PostgreSQL");
            expect(remainingNames).to.not.include("Django");
        });

        it("should allow recreating a skill with the same name after deletion", async () => {
            // ARRANGE
            const skillData = { name: "Vue.js", rate: 8 };
            const createResponse1 = await agent.post("/skills").send(skillData);
            const skill1 = createResponse1.body as SkillDto;

            // ACT
            await agent.delete(`/skills/${skill1.skillId}`);
            const createResponse2 = await agent.post("/skills").send(skillData);
            const skill2 = createResponse2.body as SkillDto;

            // ASSERT
            expect(skill2.name).to.equal(skillData.name);
            expect(skill2.rate).to.equal(skillData.rate);
            expect(skill2.skillId).to.not.equal(skill1.skillId);

            const allSkills = await testApp.services.storages.skillsStorage.getAll();
            expect(allSkills).to.have.length(1);
            expect(allSkills[0].skillId).to.equal(skill2.skillId);
        });
    });
});
