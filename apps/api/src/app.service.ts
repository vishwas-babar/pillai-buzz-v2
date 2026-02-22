import { Injectable } from '@nestjs/common';
import { testValidation } from '@pillaibuzz/validation';
import { db, users } from '@pillaibuzz/db';
import { eq } from 'drizzle-orm';
@Injectable()
export class AppService {
  getHello(): string {
    const isValid = testValidation('hello');
    const res = db.select().from(users).where(eq(users.email, 'hello')).then((res) => {
      console.log(res);
    });
    return JSON.stringify(res);
  }
}
