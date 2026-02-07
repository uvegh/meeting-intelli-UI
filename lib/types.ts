export type Meeting = {
  id: string;
  title: string;
  meetingDate: string;
  attendees: string;
  notes: string;
  summary: string | null;
  actionItems: ActionItem[] | null;
  createdAt: string;
}

export type ActionItem = {
  assignee: string;
  task: string;
  dueDate: string | null;
  priority: 'High' | 'Medium' | 'Low';
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
}

export type CreateMeetingRequest = {
  title: string;
  meetingDate: string;
  attendees: string;
  notes: string;
}

export type ChartData = {
  month: string;
  count: number;
}