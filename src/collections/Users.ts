import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "username",
  },
  auth: true,
  fields: [
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
    },
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === "string" ? value.trim().toLowerCase() : value,
        ],
      },
      validate: (val?: unknown) => {
        if (typeof val !== "string") return "Username is required";
        const v = val.trim();
        if (v.length < 3) return "Username must be at least 3 characters";
        if (v.length > 30) return "Username must be less than 30 characters";
        if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/.test(v))
          return "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or a number";
        if (v.includes("--"))
          return "Username cannot contain consecutive hyphens";
        return true;
      },
    },
    {
      ...defaultTenantArrayField,
      admin: { 
        ...(defaultTenantArrayField.admin || {}), 
        position: "sidebar"
      },
    },
  ],
};
