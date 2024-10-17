export type Slot = {
    date : string,
    time : string[]
}

export type Dentist = {
   name : string,
   slots? :  Slot[]
}

export type Appointment = {
    user : User,
    dentist : Dentist,
    date : string,
    time : string,
}

export type User = {
    name : string,
    email : string,
    password : string,
    appointments? : Appointment[] 
}