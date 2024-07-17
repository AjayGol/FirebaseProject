import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { BarChart } from "react-native-chart-kit";
import { getGraphData } from "@/constants/FirebaseFunction";
import { getMonthYearString } from "@/constants/String";

export default function DashBoardTab() {
  const [chartData, setChartData] = useState({
    labels: [],
    data: [0],
  });
  const [loading, setLoading] = useState(false);

  const chartConfig = {
    backgroundColor: Colors.light.background,
    backgroundGradientFrom: Colors.light.background,
    backgroundGradientTo: Colors.light.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(38, 188, 242, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1,
    useShadowColorFromDataset: false,
    style: {
      borderRadius: 16,
    },
  };

  useEffect(() => {
    const fetchUserGraphData = async () => {
      try {
        setLoading(true);
        const userData = await getGraphData();

        const dataByMonth = {};
        userData.forEach((user) => {
          const signUpMonth = getMonthYearString(user.createdAt);

          if (!dataByMonth[signUpMonth]) {
            dataByMonth[signUpMonth] = 0;
          }

          dataByMonth[signUpMonth]++;
        });

        const sortedMonths = Object.keys(dataByMonth);

        const data = sortedMonths.map((month) => dataByMonth[month]);

        setChartData({
          labels: sortedMonths,
          data,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchUserGraphData().then((r) => console.log("Fetch graphData"));
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : chartData.labels.length > 0 ? (
        <>
          <Text style={styles.title}>User Sign-Ups By Month</Text>
          <View style={styles.chartContainer}>
            <Text style={styles.titleInside}>Performance Matrix</Text>
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.data,
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              withVerticalLines={true}
              chartConfig={chartConfig}
              fromZero={true}
              style={styles.chartStyle}
            />
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No graph data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    paddingTop: 20,
  },
  titleInside: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "center",
  },
  chartStyle: {
    borderRadius: 16,
    paddingLeft: 0,
  },
  title: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  noDataText: {
    fontSize: 16,
    color: "grey",
    textAlign: "center",
    marginTop: 20,
  },
});
