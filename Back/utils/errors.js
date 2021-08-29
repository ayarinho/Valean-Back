
module.exports.signUpErrors= (err)=>{


    let errors = {agencyName: '', email: '',password: ''};

    if( err.message.includes('agencyName'))

    errors.pseudo ="agencyName incorrect ou deja pris !";

    if(err.message.includes('email'))

    errors.email ="Email incorrect";

    if (err.message.includes('password'))


    errors.password =" Le mot de passe doit faire 6 caratére minimum";


    if(err.code === 11000)

    errors.email =" Cet email est déja enregister"

    return errors;
}



module.exports.singInErrors= (err)=>{

    let errors= {email: '', password: ''};


    if(err.message.includes('email'))

     errors.email='email inconnu';

     if(err.message.includes("password"))

      
     errors.password = 'Password incorrect';


          return errors; 
 
    }


module.exports.uploadErrors= (err)=>{

  
    let errors= {format : '',maxSize: ''};

    if (err.message.inculdes('invalid file'))

    errors.format = "format incompatible";

    if( err.message.inculdes("max size"))

        errors.maxSize = "Le fichier  depasse 500ko";

        return errors;
     
}