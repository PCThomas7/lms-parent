import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ChevronDown, ChevronUp, Check } from "lucide-react-native";

interface Section {
  name: string;
}

interface Props {
  sections: Section[];
  currentIndex: number;
  onChange: (index: number) => void;
}

const SectionDropdown: React.FC<Props> = ({ sections, currentIndex, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.pickerWrapper}>
        <TouchableOpacity
          style={[
            styles.customPicker,
            isDropdownOpen && styles.customPickerPressed,
          ]}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLabel}>
            {sections[currentIndex]?.name || "Select Section"}
          </Text>
          {isDropdownOpen ? (
            <ChevronUp size={16} color="#374151" />
          ) : (
            <ChevronDown size={16} color="#374151" />
          )}
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdown}>
            <ScrollView
              style={styles.dropdownScroll}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {sections.map((section, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    index === sections.length - 1 && styles.dropdownItemLast,
                    index === currentIndex && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    onChange(index);
                    setIsDropdownOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      index === currentIndex && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {section.name}
                  </Text>
                  {index === currentIndex && <Check size={16} color="#D97706" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default SectionDropdown;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFBEB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    position: "relative",
    zIndex: 1000,
  },
  pickerWrapper: {
    flex: 1,
    position: "relative",
  },
  customPicker: {
    height: 40,
    borderWidth: 1,
    borderColor: "#FBBF24",
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  customPickerPressed: {
    backgroundColor: "#FDE68A",
    borderColor: "#F59E0B",
  },
  sectionLabel: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: 42, // just below the picker
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FBBF24",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownScroll: {
    maxHeight: Dimensions.get("window").height * 0.7, // 70% of screen height
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemSelected: {
    backgroundColor: "#FEF3C7",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  dropdownItemTextSelected: {
    fontWeight: "600",
    color: "#D97706",
  },
});
