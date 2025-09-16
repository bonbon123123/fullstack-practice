import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { GetSkillsResponse } from "app/api/controllers/get-skills";
import { getTestApp, TestApp } from "app/setup-integration-tests.test";
import { SkillsMockStorage } from "app/storages/SkillsMockStorage";

import { clearDb } from "../../../testUtils/clearDb"; // can be fixed to relative import after adding path to tsconfig

chai.use(chaiHttp);

describe("getSkillsController", () => {
  let testApp: TestApp;
  let agent: ChaiHttp.Agent;
  const isMock = process.env.USE_DB_MOCK === "true";

  beforeEach(async () => {
    testApp = await getTestApp();
    agent = chai.request.agent(testApp.app);

    if (testApp.services.storages.skillsStorage instanceof SkillsMockStorage) {
      (testApp.services.storages.skillsStorage as SkillsMockStorage)["skills"] = [];
    } else if (testApp.services.storages.knex) {
      await clearDb(testApp.services.storages.knex);
    }
  });

  it("should return list of skills", async () => {
    await testApp.services.storages.skillsStorage.insert({
      name: "TypeScript",
      rate: 8,
    });

    await testApp.services.storages.skillsStorage.insert({
      name: "NodeJS",
      rate: 7,
    });

    const response = await agent.get("/skills");
    const responseBody = response.body as GetSkillsResponse;

    expect(responseBody.skills.length).to.be.eq(2);
  });
});
