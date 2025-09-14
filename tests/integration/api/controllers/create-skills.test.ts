import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
import { SkillDto } from "app/api/dtos/SkillDto";
import { getTestApp, TestApp } from "app/setup-integration-tests.test";

chai.use(chaiHttp);

describe("createSkillController - Integration Tests", () => {
    let testApp: TestApp;
    let agent: ChaiHttp.Agent;

    beforeEach(async () => {
        testApp = await getTestApp();
        agent = chai.request.agent(testApp.app);
    });

    describe("createSkillController - valid skill rates", () => {
        const cases = [
            { name: "SkillZero", rate: 0, desc: "rate = 0" },
            { name: "SkillMid", rate: 5, desc: "rate = 5" },
            { name: "SkillMax", rate: 10, desc: "rate = 10" },
        ];

        cases.forEach(({ name, rate, desc }) => {
            it(`should create a new skill with ${desc}`, async () => {
                // ARRANGE
                const skillData = { name, rate };

                // ACT
                const response = await agent.post("/skills").send(skillData);

                // ASSERT
                expect(response.status).to.equal(200);
                assert.isObject(response.body, "Response should be an object");

                const skill = response.body as SkillDto;
                expect(skill).to.have.property("skillId");
                expect(skill).to.have.property("name", name);
                expect(skill).to.have.property("rate", rate);

                assert.isNumber(skill.skillId, "skillId should be a number");
                assert.isString(skill.name, "name should be a string");
                assert.isAtLeast(skill.rate, 0, "rate should be >= 0");
                assert.isAtMost(skill.rate, 10, "rate should be <= 10");
            });
        });
    });


    it("should persist skill in storage", async () => {
        // ARRANGE
        const skillData = { name: "Vue.js", rate: 7 };

        // ACT
        await agent.post("/skills").send(skillData);
        const allSkills = await testApp.services.storages.skillsStorage.getAll();
        const createdSkill = allSkills.find(skill => skill.name === skillData.name);

        // ASSERT
        assert.isDefined(createdSkill, "Created skill should exist in storage");
        expect(createdSkill!.name).to.equal(skillData.name);
        expect(createdSkill!.rate).to.equal(skillData.rate);
    });

    it("should return 500 when rate is invalid", async () => {
        // ARRANGE
        const invalidCases = [
            { name: "Angular", rate: 11 },
            { name: "Python", rate: -1 }
        ];

        for (const skillData of invalidCases) {

            // ACT
            const response = await agent.post("/skills").send(skillData);

            // ASSERT
            expect(response.status).to.equal(500);
        }
    });

    describe("skill name variations", () => {
        const cases = [
            { name: " ", desc: "very short name" }, //that should probably be invalidskill name bui i write tests not this controller
            { name: "C++/C#/.NET/!@#$%^&*()<>?:{}_+-=[];',./`~*", desc: "special characters" },
            {
                name: "A".repeat(255),
                desc: "long skill name",
            }
        ];

        cases.forEach(({ name, desc }) => {
            it(`should handle ${desc}`, async () => {
                // ARRANGE
                const skillData = { name, rate: 5 };

                // ACT
                const response = await agent.post("/skills").send(skillData);

                // ASSERT
                expect(response.status).to.equal(200);
                const skill = response.body as SkillDto;

                expect(skill).to.have.property("name", name);
                assert.isString(skill.name, "name should be string");
                assert.isNumber(skill.rate, "rate should be number");
            });
        });
    });

    describe("invalid skill names", () => {
        it("should return 500 when name is missing", async () => {
            // ARRANGE
            const skillData = { rate: 5 };

            // ACT
            const response = await agent.post("/skills").send(skillData);

            // ASSERT
            expect(response.status).to.equal(500);
        });

        it("should return 500 when name is empty string", async () => {
            // ARRANGE
            const skillData = { name: "", rate: 5 };

            // ACT
            const response = await agent.post("/skills").send(skillData);

            // ASSERT
            expect(response.status).to.equal(500);
        });

        it("should return 500 for very long name exceeding 255 chars", async () => {
            // ARRANGE
            const skillData = { name: "X".repeat(256), rate: 5 };

            // ACT
            const response = await agent.post("/skills").send(skillData);

            // ASSERT
            expect(response.status).to.equal(500);
        });
    });
});
