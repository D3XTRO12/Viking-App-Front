// components/SectionListWrapper.tsx
import React from 'react';
import { SectionList, SectionListData, Text, View, StyleSheet } from 'react-native';

interface SectionListWrapperProps {
  sections: Array<SectionListData<any>>;
}

const SectionListWrapper: React.FC<SectionListWrapperProps> = ({ sections }) => {
  return (
    <SectionList
      sections={sections}
      renderItem={({ item }) => item.component}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      keyExtractor={(item, index) => item.key + index}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
});

export default SectionListWrapper;
