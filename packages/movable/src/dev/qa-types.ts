export type QAStep = {
  title: string;
  instruction: string;
  trigger?: () => void;
  triggerLabel?: string;
  expectedLogs: string[];
  humanChecklist: string[];
};

export type QASuite = {
  id: string;
  title: string;
  description: string;
  steps: QAStep[];
};
