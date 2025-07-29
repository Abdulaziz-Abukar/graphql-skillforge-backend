const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");
const Skill = require("../../models/Skill");
const Module = require("../../models/Module");

const skillResolvers = {
  Query: {
    mySkills: async (_, __, { user }) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        const skills = await Skill.find({ owner: user._id }).populate(
          "modules"
        );

        if (!skills.length) return [];

        return skills;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },

    skill: async (_, { id }, { user }) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new GraphQLError("Invalid ID Submitted");
        }

        const skill = await Skill.findById(id).populate("modules");

        if (String(skill.owner) !== String(user._id)) {
          throw new GraphQLError("Not authorized to view this skill");
        }

        if (!skill) throw new GraphQLError("Skill does not exist.");

        return skill;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },

    filterSkills: async (_, { difficulty, search }, { user }) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        const query = { owner: user._id };

        if (difficulty) {
          query.difficulty = difficulty; // e.g., "BEGINNER"
        }

        if (search) {
          query.title = { $regex: search, $options: "i" }; // case-insensitive search
        }

        const skills = await Skill.find(query).populate("modules");

        return skills;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },
  },

  Mutation: {
    createSkill: async (
      _,
      { input: { title, description, difficulty } },
      { user }
    ) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        const newSkill = await Skill.create({
          title,
          description,
          difficulty,
          owner: user._id,
        });

        return newSkill;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },

    updateSkill: async (
      _,
      { id, input: { title, description, difficulty } },
      { user }
    ) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new GraphQLError("Invalid ID Submitted");
        }

        const skill = await Skill.findById(id);
        if (!skill) throw new GraphQLError("Skill not found");

        if (String(skill.owner) !== String(user._id)) {
          throw new GraphQLError("Not authorized to update this skill");
        }

        if (title !== undefined) skill.title = title.trim();
        if (description !== undefined) skill.description = description.trim();
        if (difficulty !== undefined) skill.difficulty = difficulty;

        const updated = await skill.save();

        return updated;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },

    deleteSkill: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError("Not authorized");

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new GraphQLError("Invalid ID Submitted");
      }

      const skill = await Skill.findById(id);
      if (!skill) throw new GraphQLError("Skill not found");

      if (String(skill.owner) !== String(user._id)) {
        throw new GraphQLError("User is not authorized to delete this skill");
      }

      const modulesDeleted = await Module.deleteMany({ skill: skill._id });
      const skillDeleted = await Skill.findByIdAndDelete(id);

      return modulesDeleted && skillDeleted ? true : false;
    },
  },
};

module.exports = skillResolvers;
