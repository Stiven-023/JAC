'use client';

import { UserManagement } from "@/components/UserManagement";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

export default function AdminPage() {

    const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Grid margin={1} overflow={"hidden"} paddingX={4} paddingTop={5}>
      <Grid>
        <Typography variant="h4" fontWeight="fontWeightBold">
          {"Administrador"}
        </Typography>
      </Grid>
      <Grid>
        <Box sx={{ width: "100%" }}>
          <Box paddingTop={3} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={(e, newValue) => setTabIndex(newValue)}
              aria-label="user management tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={"Usuarios"} />
              <Tab label={"Noticias"}  />
              <Tab label={"Eventos"} />
              <Tab label={"Servicios"}  />
            </Tabs>
          </Box>
          <Box sx={{ padding: 2 }} style={{ maxWidth: '-webkit-fill-available' }}>
              {tabIndex === 0 && <UserManagement/>}
              {tabIndex === 1 && <Typography>Gestion de Noticias</Typography>}
              {tabIndex === 2 && <Typography>Gestion de eventos</Typography>}
              {tabIndex === 3 && <Typography>Gestion de servicios</Typography>}
          </Box>
          </Box>
      </Grid>
    </Grid>

    </>
  );
}