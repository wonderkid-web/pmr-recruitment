// interfaces/member.ts

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Position {
  ANGGOTA = 'ANGGOTA',
  KETUA = 'KETUA',
  WAKIL_KETUA = 'WAKIL_KETUA',
  BENDAHARA = 'BENDAHARA',
  SEKRETARIS = 'SEKRETARIS'
}

export interface Member {
  id: string;
  name: string;
  gender: Gender | undefined;
  birthdate: Date | string;
  class: string;  // contoh: "10 IPA 1"
  position: Position;
  joined_at: Date;
  created_at: Date;
  updated_at: Date;
  status: boolean;
  password: string;
  email: string;
}

export interface CreateMemberInput {
  name: string;
  gender: Gender;
  birthdate: string;  // Menggunakan string di frontend, bisa dikonversi ke Date di backend
  class: string;
  position?: Position;
}
