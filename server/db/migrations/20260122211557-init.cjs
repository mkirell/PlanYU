"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("ADMIN", "GUEST"),
        allowNull: false,
        defaultValue: "GUEST",
      },
      token_version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("Auth", {
      auth_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      token_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "User", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      type: {
        type: Sequelize.ENUM(
          "EMAIL_VERIFY",
          "LOGIN_2FA",
          "TRUST_DEVICE",
          "REFRESH_SESSION",
        ),
        allowNull: false,
      },
      token_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("Auth", ["token_id"], {
      name: "auth_id_idx",
      unique: true,
    });
    await queryInterface.addIndex("Auth", ["user_id", "type"], {
      name: "auth_user_type_idx",
    });
    await queryInterface.addIndex("Auth", ["expires_at"], {
      name: "auth_expires_at_idx",
    });

    await queryInterface.createTable("Profile", {
      profile_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "User", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      full_name: {
        type: Sequelize.STRING,
      },
      avatar_url: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("Project", {
      project_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("Stage", {
      stage_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Project", key: "project_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("TODO", "DOING", "REVIEW", "DONE"),
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("Stage", ["project_id"], {
      name: "stage_project_idx",
    });
    await queryInterface.addIndex("Stage", ["project_id", "status"], {
      name: "stage_project_status_idx",
    });
    await queryInterface.addIndex("Stage", ["project_id", "sort_order"], {
      name: "stage_project_sort_idx",
    });

    await queryInterface.createTable("Task", {
      task_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Project", key: "project_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      stage_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Stage", key: "stage_id" },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      priority: {
        type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "MEDIUM",
      },
      due_date: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("User_Project", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "User", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      project_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "Project", key: "project_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM("OWNER", "MEMBER"),
        allowNull: false,
        defaultValue: "MEMBER",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("User_Task", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "User", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      task_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "Task", key: "task_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM("ASSIGNEE", "REVIEWER"),
        allowNull: false,
        defaultValue: "ASSIGNEE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("Role", {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("Permission", {
      permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      resource: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("Permission", ["resource", "action"], {
      name: "permission_resource_action_idx",
      unique: true,
    });

    await queryInterface.createTable("Role_Permission", {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "Role", key: "role_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "Permission", key: "permission_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("User_Role", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "User", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: "Role", key: "role_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("User_Role", ["user_id"], {
      name: "user_role_user_idx",
    });
    await queryInterface.addIndex("User_Role", ["role_id"], {
      name: "user_role_role_idx",
    });
    await queryInterface.addIndex("Role_Permission", ["role_id"], {
      name: "role_permission_role_idx",
    });
    await queryInterface.addIndex("Role_Permission", ["permission_id"], {
      name: "role_permission_permission_idx",
    });

    const now = new Date();

    await queryInterface.bulkInsert("Role", [
      {
        name: "ADMIN",
        description: "Global administrator",
        created_at: now,
        updated_at: now,
      },
      {
        name: "GUEST",
        description: "Default authenticated user",
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert("Permission", [
      {
        resource: "users",
        action: "read",
        description: "Read users",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "users",
        action: "create",
        description: "Create users",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "users",
        action: "update",
        description: "Update users",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "users",
        action: "delete",
        description: "Delete users",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "profiles",
        action: "read",
        description: "Read profiles",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "profiles",
        action: "create",
        description: "Create profiles",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "profiles",
        action: "update",
        description: "Update profiles",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "profiles",
        action: "delete",
        description: "Delete profiles",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "projects",
        action: "read",
        description: "Read projects",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "projects",
        action: "create",
        description: "Create projects",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "projects",
        action: "update",
        description: "Update projects",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "projects",
        action: "delete",
        description: "Delete projects",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "stages",
        action: "read",
        description: "Read stages",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "stages",
        action: "create",
        description: "Create stages",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "stages",
        action: "update",
        description: "Update stages",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "stages",
        action: "delete",
        description: "Delete stages",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "tasks",
        action: "read",
        description: "Read tasks",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "tasks",
        action: "create",
        description: "Create tasks",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "tasks",
        action: "update",
        description: "Update tasks",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "tasks",
        action: "delete",
        description: "Delete tasks",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-projects",
        action: "read",
        description: "Read user-project assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-projects",
        action: "create",
        description: "Create user-project assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-projects",
        action: "update",
        description: "Update user-project assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-projects",
        action: "delete",
        description: "Delete user-project assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-tasks",
        action: "read",
        description: "Read user-task assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-tasks",
        action: "create",
        description: "Create user-task assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-tasks",
        action: "update",
        description: "Update user-task assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "user-tasks",
        action: "delete",
        description: "Delete user-task assignments",
        created_at: now,
        updated_at: now,
      },
      {
        resource: "auth",
        action: "manage",
        description: "Manage auth and sessions",
        created_at: now,
        updated_at: now,
      },
    ]);

    const [roles, permissions] = await Promise.all([
      queryInterface.sequelize.query("SELECT role_id, name FROM Role", {
        type: Sequelize.QueryTypes.SELECT,
      }),
      queryInterface.sequelize.query(
        "SELECT permission_id, resource, action FROM Permission",
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      ),
    ]);

    const roleIdByName = new Map(
      roles.map((r) => [String(r.name).toUpperCase(), r.role_id]),
    );
    const permissionIdByKey = new Map(
      permissions.map((p) => [
        `${p.resource}:${p.action}`.toLowerCase(),
        p.permission_id,
      ]),
    );

    const adminRoleId = roleIdByName.get("ADMIN");
    const guestRoleId = roleIdByName.get("GUEST");
    const adminPermissionIds = [...permissionIdByKey.values()];
    const guestPermissionIds = [
      "users:read",
      "users:update",
      "profiles:read",
      "profiles:create",
      "profiles:update",
      "profiles:delete",
      "projects:read",
      "projects:create",
      "projects:update",
      "projects:delete",
      "stages:read",
      "stages:create",
      "stages:update",
      "stages:delete",
      "tasks:read",
      "tasks:create",
      "tasks:update",
      "tasks:delete",
      "user-projects:read",
      "user-projects:create",
      "user-projects:update",
      "user-projects:delete",
      "user-tasks:read",
      "user-tasks:create",
      "user-tasks:update",
      "user-tasks:delete",
    ]
      .map((key) => permissionIdByKey.get(key))
      .filter(Boolean);

    await queryInterface.bulkInsert(
      "Role_Permission",
      [
        ...adminPermissionIds.map((permission_id) => ({
          role_id: adminRoleId,
          permission_id,
          created_at: now,
          updated_at: now,
        })),
        ...guestPermissionIds.map((permission_id) => ({
          role_id: guestRoleId,
          permission_id,
          created_at: now,
          updated_at: now,
        })),
      ],
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("User_Role");
    await queryInterface.dropTable("Role_Permission");
    await queryInterface.dropTable("Permission");
    await queryInterface.dropTable("Role");
    await queryInterface.dropTable("User_Task");
    await queryInterface.dropTable("User_Project");
    await queryInterface.dropTable("Task");
    await queryInterface.dropTable("Stage");
    await queryInterface.dropTable("Project");
    await queryInterface.dropTable("Profile");
    await queryInterface.dropTable("Auth");
    await queryInterface.dropTable("User");
  },
};
