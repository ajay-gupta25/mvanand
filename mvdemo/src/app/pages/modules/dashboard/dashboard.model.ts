export interface Callfiles {
    _id: string;
    fileName: string;
    transcriptID: string;
    org_id: string;
    remark: string;
    createdBy: string;
    modifyBy: string;
    status: string;
    Agent_ID: string;
    Duration: string;
    Silence_Time: string;
    Over_Talk: string;
    Diarization: string;
    Agent_Clarity: string;
    Client_Clarity: string;
    Agent_Gender: string;
    Client_Gender: string;
    Overall_Emotion: string;
    Client_Emotion: string;
    Agent_Emotion: string;
    createdAt: Date;
    updatedAt: Date;
    callwisetranscript: Callwisetranscript[];
    company: string;
    company_id: string;
    organization: string;
    folder: string;
}

export interface Callwisetranscript {
    _id: string;
    callId: string;
    transcriptJSON: TranscriptJSON[];
    transcriptID: string;
    createdBy: string;
    modifyBy: string;
}

export interface TranscriptJSON {
    end: string;
    text: string;
    start: string;
    words: Word[];
    speaker: string;
    timestamp_end: number;
    sensitive_data?: { [key: string]: SensitiveDatum };
    timestamp_start: number;
}

export interface SensitiveDatum {
    label: string;
}

export interface Word {
    end: number;
    word: string;
    start: number;
    probability: number;
}

export interface FilterList {
    _id: string;
    name: string;
}

export interface FilterDetails {
    _id: string;
    name: string;
    term: string;
    termVal: string;
    gender_type: string;
    gender: string;
    emotion_type: string;
    emotion: string;
    Duration: string;
    Over_Talk: string;
    Silence_Time: string;
    Client_Clarity: string;
    Agent_Clarity: string;
    Diarization: string;
    user_id: string;
    createdAt: Date;
    updatedAt: Date;
}