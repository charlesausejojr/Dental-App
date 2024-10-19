export type Slot = {
    date : string,
    time : string[]
}

export type Dentist = {
   _id : string,
   name : string,
   slots? :  Slot[]
}

export type Appointment = {
    _id : string,
    user : User,
    dentist : Dentist,
    date : string,
    time : string,
}

export type User = {
    _id : string,
    name : string,
    email : string,
    password : string,
    appointments? : Appointment[] 
}