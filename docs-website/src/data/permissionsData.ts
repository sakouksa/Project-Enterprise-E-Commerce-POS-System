import { PermissionNode } from '../types/docs';

export const PERMISSION_NODES: PermissionNode[] = [
  {
    "id": "perm-1",
    "name": "company.view",
    "guard": "api",
    "domain": "COMPANY",
    "description": "Grants capability to view company resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន company",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-2",
    "name": "company.create",
    "guard": "api",
    "domain": "COMPANY",
    "description": "Grants capability to create company resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន company",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-3",
    "name": "company.update",
    "guard": "api",
    "domain": "COMPANY",
    "description": "Grants capability to update company resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន company",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-4",
    "name": "company.delete",
    "guard": "api",
    "domain": "COMPANY",
    "description": "Grants capability to delete company resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន company",
    "roles": {
      "super_admin": true,
      "admin": false,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-5",
    "name": "branch.view",
    "guard": "api",
    "domain": "BRANCH",
    "description": "Grants capability to view branch resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន branch",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-6",
    "name": "branch.create",
    "guard": "api",
    "domain": "BRANCH",
    "description": "Grants capability to create branch resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន branch",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-7",
    "name": "branch.update",
    "guard": "api",
    "domain": "BRANCH",
    "description": "Grants capability to update branch resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន branch",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-8",
    "name": "branch.delete",
    "guard": "api",
    "domain": "BRANCH",
    "description": "Grants capability to delete branch resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន branch",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-9",
    "name": "store.view",
    "guard": "api",
    "domain": "STORE",
    "description": "Grants capability to view store resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន store",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-10",
    "name": "store.create",
    "guard": "api",
    "domain": "STORE",
    "description": "Grants capability to create store resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន store",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-11",
    "name": "store.update",
    "guard": "api",
    "domain": "STORE",
    "description": "Grants capability to update store resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន store",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-12",
    "name": "store.delete",
    "guard": "api",
    "domain": "STORE",
    "description": "Grants capability to delete store resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន store",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-13",
    "name": "warehouse.view",
    "guard": "api",
    "domain": "WAREHOUSE",
    "description": "Grants capability to view warehouse resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន warehouse",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-14",
    "name": "warehouse.create",
    "guard": "api",
    "domain": "WAREHOUSE",
    "description": "Grants capability to create warehouse resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន warehouse",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-15",
    "name": "warehouse.update",
    "guard": "api",
    "domain": "WAREHOUSE",
    "description": "Grants capability to update warehouse resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន warehouse",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-16",
    "name": "warehouse.delete",
    "guard": "api",
    "domain": "WAREHOUSE",
    "description": "Grants capability to delete warehouse resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន warehouse",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-17",
    "name": "product.view",
    "guard": "api",
    "domain": "PRODUCT",
    "description": "Grants capability to view product resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន product",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": true,
      "customer": true
    }
  },
  {
    "id": "perm-18",
    "name": "product.create",
    "guard": "api",
    "domain": "PRODUCT",
    "description": "Grants capability to create product resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន product",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-19",
    "name": "product.update",
    "guard": "api",
    "domain": "PRODUCT",
    "description": "Grants capability to update product resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន product",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-20",
    "name": "product.delete",
    "guard": "api",
    "domain": "PRODUCT",
    "description": "Grants capability to delete product resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន product",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-21",
    "name": "category.view",
    "guard": "api",
    "domain": "CATEGORY",
    "description": "Grants capability to view category resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន category",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-22",
    "name": "category.create",
    "guard": "api",
    "domain": "CATEGORY",
    "description": "Grants capability to create category resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន category",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-23",
    "name": "category.update",
    "guard": "api",
    "domain": "CATEGORY",
    "description": "Grants capability to update category resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន category",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-24",
    "name": "category.delete",
    "guard": "api",
    "domain": "CATEGORY",
    "description": "Grants capability to delete category resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន category",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-25",
    "name": "brand.view",
    "guard": "api",
    "domain": "BRAND",
    "description": "Grants capability to view brand resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន brand",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-26",
    "name": "brand.create",
    "guard": "api",
    "domain": "BRAND",
    "description": "Grants capability to create brand resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន brand",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-27",
    "name": "brand.update",
    "guard": "api",
    "domain": "BRAND",
    "description": "Grants capability to update brand resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន brand",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-28",
    "name": "brand.delete",
    "guard": "api",
    "domain": "BRAND",
    "description": "Grants capability to delete brand resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន brand",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-29",
    "name": "inventory.view",
    "guard": "api",
    "domain": "INVENTORY",
    "description": "Grants capability to view inventory resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន inventory",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": true,
      "customer": false
    }
  },
  {
    "id": "perm-30",
    "name": "inventory.adjust",
    "guard": "api",
    "domain": "INVENTORY",
    "description": "Grants capability to adjust inventory resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព adjust លើធនធាន inventory",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": true,
      "customer": false
    }
  },
  {
    "id": "perm-31",
    "name": "inventory.transfer",
    "guard": "api",
    "domain": "INVENTORY",
    "description": "Grants capability to transfer inventory resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព transfer លើធនធាន inventory",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": true,
      "customer": false
    }
  },
  {
    "id": "perm-32",
    "name": "inventory.opname",
    "guard": "api",
    "domain": "INVENTORY",
    "description": "Grants capability to opname inventory resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព opname លើធនធាន inventory",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": true,
      "customer": false
    }
  },
  {
    "id": "perm-33",
    "name": "purchase.view",
    "guard": "api",
    "domain": "PURCHASE",
    "description": "Grants capability to view purchase resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន purchase",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": true,
      "customer": false
    }
  },
  {
    "id": "perm-34",
    "name": "purchase.create",
    "guard": "api",
    "domain": "PURCHASE",
    "description": "Grants capability to create purchase resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន purchase",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-35",
    "name": "purchase.update",
    "guard": "api",
    "domain": "PURCHASE",
    "description": "Grants capability to update purchase resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន purchase",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-36",
    "name": "purchase.delete",
    "guard": "api",
    "domain": "PURCHASE",
    "description": "Grants capability to delete purchase resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន purchase",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-37",
    "name": "purchase.approve",
    "guard": "api",
    "domain": "PURCHASE",
    "description": "Grants capability to approve purchase resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព approve លើធនធាន purchase",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-38",
    "name": "supplier.view",
    "guard": "api",
    "domain": "SUPPLIER",
    "description": "Grants capability to view supplier resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន supplier",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-39",
    "name": "supplier.create",
    "guard": "api",
    "domain": "SUPPLIER",
    "description": "Grants capability to create supplier resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន supplier",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-40",
    "name": "supplier.update",
    "guard": "api",
    "domain": "SUPPLIER",
    "description": "Grants capability to update supplier resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន supplier",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-41",
    "name": "supplier.delete",
    "guard": "api",
    "domain": "SUPPLIER",
    "description": "Grants capability to delete supplier resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន supplier",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-42",
    "name": "sale.view",
    "guard": "api",
    "domain": "SALE",
    "description": "Grants capability to view sale resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន sale",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-43",
    "name": "sale.create",
    "guard": "api",
    "domain": "SALE",
    "description": "Grants capability to create sale resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន sale",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-44",
    "name": "sale.return",
    "guard": "api",
    "domain": "SALE",
    "description": "Grants capability to return sale resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព return លើធនធាន sale",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-45",
    "name": "cash_register.view",
    "guard": "api",
    "domain": "CASH_REGISTER",
    "description": "Grants capability to view cash_register resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន cash_register",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-46",
    "name": "cash_register.manage",
    "guard": "api",
    "domain": "CASH_REGISTER",
    "description": "Grants capability to manage cash_register resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព manage លើធនធាន cash_register",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-47",
    "name": "order.view",
    "guard": "api",
    "domain": "ORDER",
    "description": "Grants capability to view order resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន order",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": false,
      "customer": true
    }
  },
  {
    "id": "perm-48",
    "name": "order.manage",
    "guard": "api",
    "domain": "ORDER",
    "description": "Grants capability to manage order resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព manage លើធនធាន order",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-49",
    "name": "order.refund",
    "guard": "api",
    "domain": "ORDER",
    "description": "Grants capability to refund order resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព refund លើធនធាន order",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-50",
    "name": "customer.view",
    "guard": "api",
    "domain": "CUSTOMER",
    "description": "Grants capability to view customer resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន customer",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-51",
    "name": "customer.create",
    "guard": "api",
    "domain": "CUSTOMER",
    "description": "Grants capability to create customer resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន customer",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-52",
    "name": "customer.update",
    "guard": "api",
    "domain": "CUSTOMER",
    "description": "Grants capability to update customer resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន customer",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-53",
    "name": "customer.delete",
    "guard": "api",
    "domain": "CUSTOMER",
    "description": "Grants capability to delete customer resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន customer",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-54",
    "name": "payment.view",
    "guard": "api",
    "domain": "PAYMENT",
    "description": "Grants capability to view payment resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន payment",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-55",
    "name": "payment.process",
    "guard": "api",
    "domain": "PAYMENT",
    "description": "Grants capability to process payment resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព process លើធនធាន payment",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": true,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-56",
    "name": "report.view",
    "guard": "api",
    "domain": "REPORT",
    "description": "Grants capability to view report resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន report",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-57",
    "name": "report.export",
    "guard": "api",
    "domain": "REPORT",
    "description": "Grants capability to export report resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព export លើធនធាន report",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-58",
    "name": "reports.sales.view",
    "guard": "api",
    "domain": "REPORTS",
    "description": "Grants capability to sales reports resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព sales លើធនធាន reports",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-59",
    "name": "reports.sales.export",
    "guard": "api",
    "domain": "REPORTS",
    "description": "Grants capability to sales reports resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព sales លើធនធាន reports",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-60",
    "name": "reports.sales.detail",
    "guard": "api",
    "domain": "REPORTS",
    "description": "Grants capability to sales reports resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព sales លើធនធាន reports",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-61",
    "name": "setting.view",
    "guard": "api",
    "domain": "SETTING",
    "description": "Grants capability to view setting resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន setting",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-62",
    "name": "setting.update",
    "guard": "api",
    "domain": "SETTING",
    "description": "Grants capability to update setting resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន setting",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-63",
    "name": "user.view",
    "guard": "api",
    "domain": "USER",
    "description": "Grants capability to view user resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន user",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-64",
    "name": "user.create",
    "guard": "api",
    "domain": "USER",
    "description": "Grants capability to create user resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន user",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-65",
    "name": "user.update",
    "guard": "api",
    "domain": "USER",
    "description": "Grants capability to update user resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន user",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-66",
    "name": "user.delete",
    "guard": "api",
    "domain": "USER",
    "description": "Grants capability to delete user resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន user",
    "roles": {
      "super_admin": true,
      "admin": false,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-67",
    "name": "role.view",
    "guard": "api",
    "domain": "ROLE",
    "description": "Grants capability to view role resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន role",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-68",
    "name": "role.create",
    "guard": "api",
    "domain": "ROLE",
    "description": "Grants capability to create role resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន role",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-69",
    "name": "role.update",
    "guard": "api",
    "domain": "ROLE",
    "description": "Grants capability to update role resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន role",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-70",
    "name": "role.delete",
    "guard": "api",
    "domain": "ROLE",
    "description": "Grants capability to delete role resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន role",
    "roles": {
      "super_admin": true,
      "admin": false,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-71",
    "name": "expense.view",
    "guard": "api",
    "domain": "EXPENSE",
    "description": "Grants capability to view expense resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន expense",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-72",
    "name": "expense.create",
    "guard": "api",
    "domain": "EXPENSE",
    "description": "Grants capability to create expense resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន expense",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-73",
    "name": "expense.update",
    "guard": "api",
    "domain": "EXPENSE",
    "description": "Grants capability to update expense resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន expense",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-74",
    "name": "expense.delete",
    "guard": "api",
    "domain": "EXPENSE",
    "description": "Grants capability to delete expense resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន expense",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-75",
    "name": "expense.approve",
    "guard": "api",
    "domain": "EXPENSE",
    "description": "Grants capability to approve expense resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព approve លើធនធាន expense",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-76",
    "name": "attendance.view",
    "guard": "api",
    "domain": "ATTENDANCE",
    "description": "Grants capability to view attendance resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន attendance",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-77",
    "name": "attendance.create",
    "guard": "api",
    "domain": "ATTENDANCE",
    "description": "Grants capability to create attendance resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន attendance",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-78",
    "name": "attendance.update",
    "guard": "api",
    "domain": "ATTENDANCE",
    "description": "Grants capability to update attendance resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន attendance",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-79",
    "name": "attendance.delete",
    "guard": "api",
    "domain": "ATTENDANCE",
    "description": "Grants capability to delete attendance resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន attendance",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-80",
    "name": "payroll.view",
    "guard": "api",
    "domain": "PAYROLL",
    "description": "Grants capability to view payroll resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន payroll",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": true,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-81",
    "name": "payroll.create",
    "guard": "api",
    "domain": "PAYROLL",
    "description": "Grants capability to create payroll resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន payroll",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-82",
    "name": "payroll.update",
    "guard": "api",
    "domain": "PAYROLL",
    "description": "Grants capability to update payroll resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន payroll",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-83",
    "name": "payroll.delete",
    "guard": "api",
    "domain": "PAYROLL",
    "description": "Grants capability to delete payroll resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន payroll",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-84",
    "name": "marketing.view",
    "guard": "api",
    "domain": "MARKETING",
    "description": "Grants capability to view marketing resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន marketing",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-85",
    "name": "marketing.create",
    "guard": "api",
    "domain": "MARKETING",
    "description": "Grants capability to create marketing resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន marketing",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-86",
    "name": "marketing.update",
    "guard": "api",
    "domain": "MARKETING",
    "description": "Grants capability to update marketing resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន marketing",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-87",
    "name": "marketing.delete",
    "guard": "api",
    "domain": "MARKETING",
    "description": "Grants capability to delete marketing resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន marketing",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-88",
    "name": "cms.view",
    "guard": "api",
    "domain": "CMS",
    "description": "Grants capability to view cms resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន cms",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-89",
    "name": "cms.create",
    "guard": "api",
    "domain": "CMS",
    "description": "Grants capability to create cms resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន cms",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-90",
    "name": "cms.update",
    "guard": "api",
    "domain": "CMS",
    "description": "Grants capability to update cms resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន cms",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-91",
    "name": "cms.delete",
    "guard": "api",
    "domain": "CMS",
    "description": "Grants capability to delete cms resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន cms",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-92",
    "name": "shipping.view",
    "guard": "api",
    "domain": "SHIPPING",
    "description": "Grants capability to view shipping resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន shipping",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-93",
    "name": "shipping.create",
    "guard": "api",
    "domain": "SHIPPING",
    "description": "Grants capability to create shipping resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព create លើធនធាន shipping",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-94",
    "name": "shipping.update",
    "guard": "api",
    "domain": "SHIPPING",
    "description": "Grants capability to update shipping resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព update លើធនធាន shipping",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-95",
    "name": "shipping.delete",
    "guard": "api",
    "domain": "SHIPPING",
    "description": "Grants capability to delete shipping resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព delete លើធនធាន shipping",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-96",
    "name": "audit_log.view",
    "guard": "api",
    "domain": "AUDIT_LOG",
    "description": "Grants capability to view audit_log resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន audit_log",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-97",
    "name": "notification.view",
    "guard": "api",
    "domain": "NOTIFICATION",
    "description": "Grants capability to view notification resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព view លើធនធាន notification",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  },
  {
    "id": "perm-98",
    "name": "notification.manage",
    "guard": "api",
    "domain": "NOTIFICATION",
    "description": "Grants capability to manage notification resources",
    "descriptionKh": "អនុញ្ញាតឱ្យធ្វើសកម្មភាព manage លើធនធាន notification",
    "roles": {
      "super_admin": true,
      "admin": true,
      "manager": false,
      "cashier": false,
      "warehouse_staff": false,
      "customer": false
    }
  }
];
