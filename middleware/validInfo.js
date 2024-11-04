module.exports = (req,res,next) => {
    const {email, name, password,matricula} = req.body;

    function validEmail(userEmail){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    }

    if(req.matricula > 9){
        return res.status(401).json("Matricula no debe ser mayor a 9 caracteres");
    }

    if(req.path === "/register"){
        if(![email,name,password,matricula].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        }else if(!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }
    }else if(req.path === "/login"){
        if(![email,password].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        }else if(!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }
}

next();
};