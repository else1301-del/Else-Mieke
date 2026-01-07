
export enum QuestionType {
  OPEN = 'open',
  MEERKEUZE = 'meerkeuze',
  JUIST_ONJUIST = 'juist_onjuist',
  VOLGORDE = 'volgorde',
  COMBINEER = 'combineer',
  INVUL = 'invul',
  CASUS = 'casus',
  BRONANALYSE = 'bronanalyse',
  STELLING = 'stelling'
}

export enum LevelProfile {
  MH_1 = 'MH_1',
  MH_2 = 'MH_2',
  HV_1 = 'HV_1',
  HV_2 = 'HV_2',
  M_3 = 'M_3',
  M_4 = 'M_4',
  H_3 = 'H_3',
  H_4 = 'H_4',
  H_5 = 'H_5'
}

export enum RTTIMode {
  PERCENTAGES = 'percentages',
  COUNTS = 'counts'
}

export enum Brondichtheid {
  LAAG = 'laag',
  MIDDEL = 'middel',
  HOOG = 'hoog'
}

export enum Moeilijkheid {
  EENVOUDIG = 'eenvoudig',
  GEBANCEERD = 'gebanceerd',
  MOEILIJK = 'moeilijk'
}

export interface RTTITarget {
  r: number;
  t1: number;
  t2: number;
  i: number;
}

export interface GeneratorParams {
  jaarlaag: string;
  niveauProfiel: LevelProfile;
  vraagTypes: QuestionType[];
  rttiTarget: RTTITarget;
  rttiWeights: RTTITarget; // Percentages (0-100) or relative weights
  rttiMode: RTTIMode;
  aantalVragen: number;
  brondichtheid: Brondichtheid;
  leerdoelen: string;
  begrippen: string;
  bronnen: string;
  leesniveau: '2F' | '3F';
  moeilijkheidsverdeling: Moeilijkheid;
  toetstijd: number;
  lockRtti: boolean;
}

export interface Source {
  id: string;
  title: string;
  content: string;
  type: 'tekst' | 'tabel' | 'kaart' | 'grafiek';
}

export interface Question {
  id: number;
  punten: number;
  rtti: 'R' | 'T1' | 'T2' | 'I';
  bron_id: string[];
  dimensie: 'fysisch geografisch' | 'sociaal economisch' | 'integratief';
  kernconcept: 'verscheidenheid' | 'samenhang' | 'schaal' | 'perceptie' | 'verandering in tijd';
  vraag_tekst: string;
  opties?: string[];
  type: QuestionType;
  bronrechtvaardiging: string;
}

export interface TeacherViewItem {
  vraag_id: number;
  rtti: string;
  motivatie: string;
  punten: number;
  antwoord_model: string;
  beoordelingsregels: string[];
  vereiste_vaktaal: string[];
  veelgemaakte_fouten: string[];
  syllabus_domein: string;
  tijdsindicatie: string;
  geografische_schaal: string;
}

export interface GeneratedTest {
  meta: {
    titel: string;
    niveau: string;
    niveauProfiel: LevelProfile;
    enabledQuestionTypes: QuestionType[];
    leerjaar?: string;
    onderwerp: string;
    tijd: number;
    questionCount: number;
    totalPoints: number;
    rttiCountsTarget: RTTITarget;
    stream?: string;
    year?: string;
  };
  sources: Source[];
  student_view: Question[];
  teacher_view: TeacherViewItem[];
  beeld_prompts: string[];
  quality_report: {
    rtti_dekking: string;
    bron_gebruik: string;
    taal_check: string;
    google_proof_check: string;
  };
}

export interface ValidationReport {
  warnings: string[];
  quick_fixes: string[];
  missing_information: string[];
  suggested_edits?: string[];
  feasibility: 'ok' | 'risk';
}

export interface ChangeItem {
  target: 'vraag' | 'bron';
  id: string;
  change_type: 'edit' | 'replace' | 'add' | 'remove';
  before: string;
  after: string;
}

export interface CoConstructorResponse {
  changes: ChangeItem[];
  updated_test: GeneratedTest;
  quality_delta: {
    rtti_ok: boolean;
    types_ok: boolean;
    clustering_ok: boolean;
    notes: string[];
  };
}

export interface ExtractorOutput {
  pages: {
    page_id: string;
    raw_text: string;
    detected_sections: any[];
    warnings: string[];
  }[];
  leerdoelen: any[];
  begrippen: any[];
  bronnen: any[];
  leertekst: any;
  global_warnings: string[];
}

export interface NormalizedOutput {
  normalized_leerdoelen: string[];
  normalized_begrippen: any[];
  normalized_bronnen: any[];
  normalized_leertekst: string;
  notes: string[];
}

export interface QAAuditIssue {
  severity: 'low' | 'medium' | 'high';
  location: string;
  problem: string;
  suggested_fix: string;
}

export interface QAAuditReport {
  pass: boolean;
  issues: QAAuditIssue[];
  suggested_fixes: string[];
}
