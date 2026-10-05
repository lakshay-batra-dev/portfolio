export type ChallengeVisualization = {
  nums: number[];
  target: number;
  pair: [number, number];
};

export type ChallengeLine = {
  number: number;
  text: string;
};

export type Challenge = {
  id: string;
  title: string;
  language: "cpp";
  lines: ChallengeLine[];
  flaggedLine: number;
  expectedFix: string;
  visualization: ChallengeVisualization;
};

const twoSumSource = `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];

        if (seen.find(complement) == seen.end()) {
            return {seen[complement], i};
        }

        seen[nums[i]] = i;
    }

    return {};
}`;

export const twoSumChallenge: Challenge = {
  id: "two-sum",
  title: "Two Sum",
  language: "cpp",
  lines: twoSumSource.split("\n").map((text, index) => ({
    number: index + 1,
    text,
  })),
  flaggedLine: 7,
  expectedFix: "if (seen.find(complement) != seen.end()) {",
  visualization: {
    nums: [2, 7, 11, 15],
    target: 9,
    pair: [0, 1],
  },
};

export const challenges: Challenge[] = [twoSumChallenge];
