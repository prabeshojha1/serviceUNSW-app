import { StyleSheet, Text, View } from "react-native";

export default function RelevanceBadge({value}:{value:string}){

const color={
    Low:"#D6D6D6",
    Medium:"#FFE082",
    High:"#81C784",
    "Very High":"#4CAF50"
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