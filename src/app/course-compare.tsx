import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import CompareCourseCard from "@/components/course-compare-card";
import ComparisonRow from "@/components/course-compare-row";

const courses = [
    {
        id: "1",
        code: "COMP2521",
        title: "Data Structures and Algorithms",
        uoc: 6,
        level: 2,
        prerequisites: "COMP1511",
        terms: ["T1", "T2"],
        difficulty: "Medium",
        relevance: "High",
        summary: "Focus on data structures and algorithms."
    },
    {
        id: "2",
        code: "COMP2041",
        title: "Computer Systems",
        uoc: 6,
        level: 2,
        prerequisites: "COMP1511",
        terms: ["T1"],
        difficulty: "Hard",
        relevance: "High",
        summary: "Learn about computer architecture."
    },
    {
        id: "3",
        code: "COMP3331",
        title: "Software Engineering",
        uoc: 6,
        level: 3,
        prerequisites: "COMP2521",
        terms: ["T1", "T2"],
        difficulty: "Hard",
        relevance: "Very High",
        summary: "Design large software systems."
    }
];

export default function ComparePage() {
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                />

                <Text style={styles.headerTitle}>
                    Compare courses
                </Text>

                <Ionicons
                    name="trash-outline"
                    size={22}
                />
            </View>

            <ScrollView>

                <View style={styles.cardsRow}>
                    {courses.map(course => (
                        <CompareCourseCard
                            key={course.id}
                            course={course}
                        />
                    ))}
                </View>

                <View style={styles.table}>

                    <ComparisonRow
                        title="UOC"
                        values={courses.map(c => c.uoc.toString())}
                    />

                    <ComparisonRow
                        title="Level"
                        values={courses.map(c => c.level.toString())}
                    />

                    <ComparisonRow
                        title="Difficulty"
                        values={courses.map(c => c.difficulty)}
                        type="difficulty"
                    />

                    <ComparisonRow
                        title="Prerequisites"
                        values={courses.map(c => c.prerequisites)}
                    />

                    <ComparisonRow
                        title="Terms offered"
                        values={courses.map(c => c.terms.join(", "))}
                    />

                    <ComparisonRow
                        title="Relevance"
                        values={courses.map(c => c.relevance)}
                        type="relevance"
                    />

                    <ComparisonRow
                        title="Summary"
                        values={courses.map(c => c.summary)}
                    />

                </View>

            </ScrollView>

            <View style={styles.bottom}>
                <Pressable style={styles.button}>
                    <Ionicons
                        name="add"
                        size={20}
                        color="black"
                    />

                    <Text style={styles.buttonText}>
                        Add selected to MyPlan
                    </Text>
                </Pressable>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

container:{
    flex:1,
    backgroundColor:"#fff"
},

header:{
    height:60,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:18,
    borderBottomWidth:1,
    borderColor:"#ECECEC"
},

headerTitle:{
    fontSize:20,
    fontWeight:"700"
},

cardsRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    padding:16,
    gap:8
},

table:{
    marginHorizontal:16,
    borderWidth:1,
    borderColor:"#ECECEC",
    borderRadius:12,
    overflow:"hidden",
    marginBottom:100
},

bottom:{
    position:"absolute",
    bottom:0,
    width:"100%",
    backgroundColor:"#fff",
    padding:16
},

button:{
    backgroundColor:"#FFD500",
    height:54,
    borderRadius:12,
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row"
},

buttonText:{
    fontWeight:"700",
    fontSize:16,
    marginLeft:8
}

});