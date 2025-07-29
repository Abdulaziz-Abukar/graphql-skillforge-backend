const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");
const Module = require("../../models/Module");
const Skill = require("../../models/Skill");

const moduleResolver = {
  Mutation: {
    addModule: async (_, { skillId, input: { title, notes } }, { user }) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        if (!mongoose.Types.ObjectId.isValid(skillId)) {
          throw new GraphQLError("Invalid ID Submitted");
        }

        const skill = await Skill.findById(skillId);

        if (!skill) throw new GraphQLError("Skill doesn't exist");

        if (String(skill.owner) !== String(user._id)) {
          throw new GraphQLError("User cannot add this module");
        }

        const newModule = await Module.create({
          title: title.trim(),
          notes: notes?.trim() || "",
          skill: skill._id,
        });

        skill.modules.push(newModule._id);

        await skill.save();

        return newModule;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },

    updateModule: async (_, { id, input: { title, notes } }, { user }) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new GraphQLError("Invalid ID Submitted");
        }

        const updateModule = await Module.findById(id).populate("skill");

        if (!updateModule) throw new GraphQLError("Module does not exist");
        if (String(updateModule.skill.owner) !== String(user._id)) {
          throw new GraphQLError("User is unauthorized to update skill");
        }

        if (title !== undefined) updateModule.title = title.trim();
        if (notes !== undefined) updateModule.notes = notes.trim();

        await updateModule.save();

        return updateModule;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },

    deleteModule: async (_, { id }, { user }) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new GraphQLError("Invalid ID Submitted");
        }

        const deletedModule = await Module.findById(id).populate("skill");

        if (!deletedModule) throw new GraphQLError("Module does not exist");

        if (String(deletedModule.skill.owner) !== String(user._id)) {
          throw new GraphQLError("User is not authorized to delete module");
        }

        await Skill.findOneAndUpdate(deletedModule.skill._id, {
          $pull: { modules: deletedModule._id },
        });

        await Module.findByIdAndDelete(id);

        return true;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },

    toggleModuleComplete: async (_, { moduleId }, { user }) => {
      try {
        if (!user) throw new GraphQLError("Not authenticated");

        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
          throw new GraphQLError("Invalid ID Submitted");
        }

        const toggleModule = await Module.findById(moduleId).populate("skill");

        if (!toggleModule) throw new GraphQLError("Module does not exist");

        if (String(toggleModule.skill.owner) !== String(user._id)) {
          throw new GraphQLError(
            "User is not authorized to toggle this module"
          );
        }

        toggleModule.completed = !toggleModule.completed;

        await toggleModule.save();

        return toggleModule;
      } catch (err) {
        console.error(err);
        throw new GraphQLError(err.message || "Something went wrong");
      }
    },
  },
};

module.exports = moduleResolver;
