import I18n from "I18n";
import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";
import { buildPermissionDescription } from "discourse/models/permission-type";

export default DiscourseRoute.extend({
  showFooter: true,

  titleToken() {
    return I18n.t("groups.permissions.title");
  },

  model() {
    let group = this.modelFor("group");

    return ajax(`/g/${group.name}/permissions`)
      .then(permissions => {
        permissions.forEach(permission => {
          permission.description = buildPermissionDescription(
            permission.permission_type
          );
        });
        return { permissions };
      })
      .catch(() => {
        this.transitionTo("group.members", group);
      });
  },

  setupController(controller, model) {
    this.controllerFor("group-permissions").setProperties({ model });
    this.controllerFor("group").set("showing", "permissions");
  }
});
