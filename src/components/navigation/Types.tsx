import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type WorkOrderScreenParams = {
  isStaff: boolean;
  userId: string | null;
};

export type RootStackParamList = {
  PublicTabs: undefined;
  PrivateTabs: undefined;
};

export type PrivateTabParamList = {
  
  AddWorkOrder: undefined;
  AddDiagnosticPoint: undefined;
  HandleUsers: undefined;
  AddDevice: undefined;
  WorkOrderScreen: WorkOrderScreenParams;

};

export type PrivateTabScreenProps<T extends keyof PrivateTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<PrivateTabParamList, T>,
    StackScreenProps<RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
