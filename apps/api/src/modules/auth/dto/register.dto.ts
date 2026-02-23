import {
   IsEmail,
   IsOptional,
   IsString,
   Matches,
   MaxLength,
   MinLength,
} from "class-validator"

export class RegisterDto {
   @IsOptional()
   @IsString()
   avatar?: string

   @IsString()
   @MinLength(4)
   @MaxLength(50)
   userID!: string

   @IsEmail()
   email!: string

   @IsString()
   @MinLength(8)
   @MaxLength(50)
   @Matches(/[A-Z]/, {
      message: "password must contain at least one uppercase letter",
   })
   password!: string

   @IsString()
   @MinLength(2)
   @MaxLength(50)
   name!: string
}
