export interface SubmissionsByDay {
    date: string,
    submissions: number
}

export interface UserCalender {
    activeYears: number[],
    submissionsCalender: SubmissionsByDay[]
}

export interface ProblemsCount {
    total: number,
    easy: number,
    medium: number,
    hard: number
}