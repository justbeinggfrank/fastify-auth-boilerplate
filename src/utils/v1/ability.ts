import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'enable' | 'disable';
export type Subjects = 'User' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(role: string): AppAbility {
  const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (role === 'superadmin') {
    can('manage', 'all');
  } else if (role === 'admin') {
    can(['read'], 'User');
  } else {
    can(['read'], 'User');
  }

  return createMongoAbility(rules);
}
