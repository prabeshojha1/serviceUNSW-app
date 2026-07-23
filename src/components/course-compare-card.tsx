import { Course } from "@/types/course";
import { StyleSheet, Text, View } from "react-native";

interface Props{
    course:Course;
}

export default function CompareCourseCard({course}:Props){

    return(

        <View style={styles.card}>

            <Text style={styles.code}>
                {course.code}
            </Text>

            <Text numberOfLines={2} style={styles.title}>
                {course.title}
            </Text>

        </View>

    )

}

const styles=StyleSheet.create({

card:{
    flex:1,
    borderWidth:1,
    borderColor:"#E5E5E5",
    borderRadius:10,
    padding:10,
    minHeight:80
},

code:{
    color:"#0057B8",
    fontWeight:"700",
    marginBottom:4
},

title:{
    fontSize:12,
    color:"#555"
}

});