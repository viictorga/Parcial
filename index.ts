import axios from "axios";
import express from "express"
import cors from "cors"


const app = express()
const port = 3000;

app.use(cors())
app.use(express.json())

type LD = {
id: number,
filmName: string,
rotationType: "CAV"| "CLV",
region: string,
lengthMinutes: number,
videoFormat: "NTSC" | "PAL"
}

let discos : LD[] = [{id: 1, filmName: "cars", rotationType: "CAV", region: "America", lengthMinutes: 95, videoFormat: "NTSC"}, 
    {id: 2, filmName: "interestellar", rotationType: "CAV", region: "EspacioProfundo", lengthMinutes: 173, videoFormat: "NTSC"}] // dura 173 mins solo la version original, ni caso a google que no sabe lo que dice
 
    
app.get("/ld", (req, res)=>{
    res.status(200).json(discos)
})

app.get("/ld/:id", (req, res)=>{
    const idNum: number = Number(req.params.id);
    const seguir : LD | undefined = discos.find((n) => idNum === n.id);
    seguir ? res.status(200).json(seguir) : res.status(404).json({message: "Disco no encontrado"})
})

app.post("/ld", (req,res)=>{
    const newID : number= Date.now();
    const nuevoDisco : LD= { ...req.body, id:newID} 
    discos.push(nuevoDisco)
    res.status(201).json(nuevoDisco);
})
app.delete("/ld/:id", (req, res)=>{
    const ID :number = Number(req.params.id);
    const seguir : boolean = discos.some((n)=> ID === n.id)
    if(!seguir){
        res.status(404).json({message: "No existe el id que quieres borra maquina"})
    }
    discos = discos.filter((n)=> ID !== n.id); // va este filter mola enrollate y dame nota, que cojo todos menos el que hay que eliminar, no lo he leido palabrita del señor (si eres católico, sinó al dios al que adores)
    res.status(202).send("Borrado chaval, eres un maquina"); // el cod de status te planto el 202 que me ha dicho google que es el típico, sin mas, además es múltiplo de 2 y la resta de sus números es 0, queda bonito
})


app.listen(3000, () => console.log("Servidor en http://localhost:3000"));


const testAPI = async()=>{
    const miPromesa = (await(axios.get<LD[]>(`http://localhost:3000/ld`))).data
    console.log(miPromesa);
    const miNuevoDisco : LD = {id: 123, filmName: "cars2", rotationType: "CAV", region: "America/Londres/Japon", lengthMinutes: 106, videoFormat: "NTSC"};
    axios.post(`http://localhost:3000/ld`, miNuevoDisco);
    const miPromesa2 = (await(axios.get<LD[]>(`http://localhost:3000/ld`))).data
    console.log(miPromesa2);
    const disco: LD | undefined =miPromesa2.find((n)=> miNuevoDisco.filmName === n.filmName && miNuevoDisco.lengthMinutes === miNuevoDisco.lengthMinutes) 
    let idDiscoElim : number;
    disco ? idDiscoElim = disco.id : idDiscoElim = 0;
    axios.delete(`http://localhost:3000/ld/${idDiscoElim}`)
    const miPromesa3 = (await(axios.get<LD[]>(`http://localhost:3000/ld`))).data
    console.log(miPromesa3);
}
setTimeout((testAPI), 1000);