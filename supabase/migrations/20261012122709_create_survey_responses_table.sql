/*
# Create survey_responses table for DRC Sponsoring Link

1. New Tables
- `survey_responses`
  - `id` (uuid, primary key, auto-generated)
  - `profile` (text, not null) — which questionnaire: 'entreprise', 'beneficiaire', or 'public'
  - `responses` (jsonb, not null) — flexible JSON object storing all answers keyed by question ID
  - `questionnaire_version` (text, not null, default '1.0') — version tracking so questions can evolve
  - `submitted_at` (timestamptz, default now()) — when the response was submitted
2. Security
- Enable RLS on `survey_responses`.
- This is a no-auth survey app (no sign-in screen). Allow anon + authenticated to INSERT (to submit surveys)
  and SELECT (to view aggregate results). UPDATE and DELETE are not needed from the client.
3. Indexes
- Index on `profile` for filtering results by questionnaire type.
- Index on `submitted_at` for ordering by date.
4. Notes
- The `responses` column uses jsonb so questions can be added, modified, or removed without schema changes.
- No personal data is collected. If coordinates are needed later, they will be optional and stored in the same jsonb field.
*/

CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile text NOT NULL CHECK (profile IN ('entreprise', 'beneficiaire', 'public')),
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  questionnaire_version text NOT NULL DEFAULT '1.0',
  submitted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_survey_responses" ON survey_responses;
CREATE POLICY "anon_select_survey_responses"
ON survey_responses FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_survey_responses" ON survey_responses;
CREATE POLICY "anon_insert_survey_responses"
ON survey_responses FOR INSERT
TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_survey_responses_profile ON survey_responses (profile);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses (submitted_at DESC);
