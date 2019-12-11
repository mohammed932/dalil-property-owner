
export interface EmployeeInfo {
    working_images: string[];
    personal_files: string[];
    categories: string[];
    cities: string[];
    areas: string[];
    is_active: boolean;
    is_verified: boolean;
}

export interface User {
    _id: string;
    mobile: string;
    name: string;
    roles: string[];
    employeeInfo: EmployeeInfo;
    profile_image: string;
}


export interface UserData {
    _id: string;
    mobile: string;
    name: string;
    roles: string[];
    token: string;
    rate: number;
}

