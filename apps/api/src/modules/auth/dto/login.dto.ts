import {
   IsEmail,
   IsString,
   Matches,
   MaxLength,
   MinLength,
} from "class-validator"

export class LoginDto {
   @IsEmail()
   email!: string

   @IsString()
   @MinLength(8)
   @MaxLength(50)
   @Matches(/[A-Z]/, {
      message: "password must contain at least one uppercase letter",
   })
   password!: string
}
