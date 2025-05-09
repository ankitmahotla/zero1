-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "codeSnippets" JSONB,
ADD COLUMN     "referenceSolutions" JSONB;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "problemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestCaseResult" ALTER COLUMN "submissionId" DROP NOT NULL;
