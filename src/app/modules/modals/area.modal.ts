
export interface Ar {
    name: string;
}

export interface Translation {
    ar: Ar;
}

export interface Location {
    type: string;
    coordinates: string;
}



export interface NewArea {
    name: string;
    location: string[];
}

export interface Area {
    _id: string;
    name: string;
    translation: Translation;
    location: Location;
    city: string;
    created_at: Date;
    updated_at: Date;
    __v: number;
}



