import { Apartment, LocalShipping, Person } from "@mui/icons-material";
import {
  Fab,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { UserType } from "../../types";

const Wrapper = styled("div")({
  position: "absolute",
  top: 24,
  right: 24,
  zIndex: 1,
});

const MenuContainer = styled("div")({
  position: "absolute",
  top: 48,
  right: 0,
  zIndex: 1,
  background: "white",
});

const CustomMenuList = styled(MenuList)({
  display: "flex",
  flexDirection: "column",
});

type Props = {
  currentUserType: UserType;
  setCurrentUserType: React.Dispatch<React.SetStateAction<UserType>>;
};

const UserTypeSwitcher = ({ currentUserType, setCurrentUserType }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderCorrectUserTypeIcon = () => {
    switch (currentUserType) {
      default:
      case "Construction":
        return <Person />;
      case "Delivery":
        return <LocalShipping />;
      case "Management":
        return <Apartment />;
    }
  };

  const handleUserTypeChanged = (userType: UserType) => {
    setCurrentUserType(userType);
    setIsMenuOpen(false);
  };

  return (
    <Wrapper>
      <div style={{ position: "relative" }}>
        <Fab
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          size="small"
          color="primary"
        >
          {renderCorrectUserTypeIcon()}
        </Fab>
        {isMenuOpen && (
          <MenuContainer>
            <CustomMenuList>
              <MenuItem
                onClick={() => {
                  handleUserTypeChanged("Construction");
                }}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText>Construction</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleUserTypeChanged("Delivery");
                }}
              >
                <ListItemIcon>
                  <LocalShipping />
                </ListItemIcon>
                <ListItemText>Delivery</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleUserTypeChanged("Management");
                }}
              >
                <ListItemIcon>
                  <Apartment />
                </ListItemIcon>
                <ListItemText>Management</ListItemText>
              </MenuItem>
            </CustomMenuList>
          </MenuContainer>
        )}
      </div>
    </Wrapper>
  );
};

export default UserTypeSwitcher;
