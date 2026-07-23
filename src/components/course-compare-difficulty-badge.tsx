import { StyleSheet, Text, View } from "react-native";

export default function DifficultyBadge({value}:{value:string}){

const color={
    Easy:"#4CAF50",
    Medium:"#FFD54F",
    Hard:"#FF7043"
}[value] ?? "#DDD";

return(

<View style={[styles.badge,{backgroundColor:color}]}>
<Text style={styles.text}>{value}</Text>
</View>

)

}

const styles=StyleSheet.create({

badge:{
    borderRadius:6,
    paddingHorizontal:10,
    paddingVertical:4
},

text:{
    fontWeight:"600",
    fontSize:12
}

});