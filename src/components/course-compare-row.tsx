import { StyleSheet, Text, View } from "react-native";
import DifficultyBadge from "./course-compare-difficulty-badge";
import RelevanceBadge from "./course-compare-relevance-badge";

interface Props{
    title:string;
    values:string[];
    type?:"difficulty"|"relevance";
}

export default function ComparisonRow({
    title,
    values,
    type
}:Props){

    return(

        <View style={styles.row}>

            <View style={styles.left}>
                <Text style={styles.heading}>
                    {title}
                </Text>
            </View>

            {values.map((value,index)=>

                <View
                    key={index}
                    style={styles.cell}
                >

                    {type==="difficulty" ? (

                        <DifficultyBadge value={value}/>

                    ) : type==="relevance" ? (

                        <RelevanceBadge value={value}/>

                    ) : (

                        <Text style={styles.value}>
                            {value}
                        </Text>

                    )}

                </View>

            )}

        </View>

    )

}

const styles=StyleSheet.create({

row:{
    flexDirection:"row",
    borderBottomWidth:1,
    borderColor:"#ECECEC",
    minHeight:60
},

left:{
    width:110,
    justifyContent:"center",
    paddingHorizontal:10,
    backgroundColor:"#FAFAFA"
},

heading:{
    fontWeight:"600",
    fontSize:13
},

cell:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:8
},

value:{
    textAlign:"center",
    fontSize:13
}

});