type CharData = {
    cn: string,
    name: string,
    defaultSpec: Ability
    skills: {
        passive: SkillAbility,
        Q: SkillAbility,
        E: SkillAbility,
        Shift: SkillAbility,
        Wheel: SkillAbility,
    },
    des: {
        passive: string,
        Q: string,
        E: string,
        Shift: string,
        Wheel: string,
    }
}