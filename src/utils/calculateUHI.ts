export function calculateUHI(temp:number){

 if(temp > 34) return "HIGH"
 if(temp > 30) return "MEDIUM"
 return "LOW"

}