import { SkillEntity } from "app/entities/SkillEntity";
import { SkillsStorage } from "app/storages/SkillsStorage";

export class SkillsMockStorage implements SkillsStorage {
  private skills: SkillEntity[] = [];

  async getAll(): Promise<SkillEntity[]> {
    return this.skills;
  }

  async insert(data: Omit<SkillEntity, "skillId" | "updatedAt">): Promise<SkillEntity> {
    const skillEntity = {
      skillId: parseInt(this.skills.length + "" + Date.now()),
      name: data.name,
      rate: data.rate,
      updatedAt: new Date(),
    };
    this.skills.push(skillEntity);
    return skillEntity;
  }

  async delete(skillId: number): Promise<boolean> {
    const initialLength = this.skills.length;
    this.skills = this.skills.filter(skill => skill.skillId !== skillId);
    return this.skills.length < initialLength;
  }
}