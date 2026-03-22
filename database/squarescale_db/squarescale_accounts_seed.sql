-- Optional seed: two placeholder chart-of-accounts rows so the table is not empty.
-- Run after `accounts` exists and `users` has at least one row (see userId below).
-- Safe to run once; if accounts already exist with these names/numbers, skip or delete duplicates first.

USE squarescale;

-- Links to an existing user (administrator). Change `userId` if needed to match your DB (e.g. 3 = adminBraden, 6 = adminBrandon).
SET @seed_user_id = 6;

INSERT INTO `accounts` (
  `accountName`,
  `accountNumber`,
  `description`,
  `normalSide`,
  `accountCategory`,
  `accountSubcategory`,
  `initialBalance`,
  `debit`,
  `credit`,
  `balance`,
  `createdAt`,
  `userId`,
  `accountOrder`,
  `statementType`,
  `commentText`,
  `isActive`
) VALUES
(
  'Cash - Operating',
  '1010',
  'Placeholder: general operating cash',
  'Debit',
  'Asset',
  'Current Assets',
  0.00,
  0.00,
  0.00,
  0.00,
  NOW(),
  @seed_user_id,
  '01',
  'BS',
  'Seed / demo account',
  1
),
(
  'Accounts Payable',
  '2010',
  'Placeholder: trade payables',
  'Credit',
  'Liability',
  'Current Liabilities',
  0.00,
  0.00,
  0.00,
  0.00,
  NOW(),
  @seed_user_id,
  '02',
  'BS',
  'Seed / demo account',
  1
);
