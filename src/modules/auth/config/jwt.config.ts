import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => {
    const secret = process.env.SECRETORPRIVATEKEY || 'hOLaMUndoKEY25%1!!T0keN@772$';
    
    console.log('🔧 Loading JWT config...');
    console.log('🔧 SECRETORPRIVATEKEY env:', process.env.SECRETORPRIVATEKEY ? 'EXISTS' : 'NOT SET');
    console.log('🔧 Final secret:', secret.substring(0, 10) + '...');
    
    return {
      secret: secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_IN || '3600s',
      },
    };
  },
);


// import { registerAs } from '@nestjs/config';
// import { JwtModuleOptions } from '@nestjs/jwt';

// export default registerAs(
//   'jwt',
//   (): JwtModuleOptions => ({
//     secret: process.env.SECRETORPRIVATEKEY || 'hOLaMUndoKEY25%1!!T0keN@772$',
//     signOptions: {
//       expiresIn: process.env.JWT_EXPIRE_IN || '3600s',
//     },
//   }),
// );
  