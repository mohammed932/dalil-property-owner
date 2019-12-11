
export interface Ar {
    name: string;
}

export interface Translation {
    ar: Ar;
}

export interface Location {
    type: string;
    coordinates: string[];
}
export interface NewCity {
    name: string;
    location: string[];
}

export interface City {
    _id: string;
    name: string;
    translation: Translation;
    location: Location;
    created_at: Date;
    updated_at: Date;
    __v: number;
}



