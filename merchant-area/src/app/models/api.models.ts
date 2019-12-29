export class JwtAuthModel {
    access: string;
    refresh: string;
}

export class JwtAuthErrorModel {
    non_field_errors: Array<string>;
}
