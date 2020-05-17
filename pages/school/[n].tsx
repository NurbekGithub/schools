import { useState } from 'react';
import Head from "next/head";
import Router from 'next/router'
import fs from "fs";
import xlsx from "xlsx";
import Label from "../../src/components/Label";
import { Labels, Circles } from "../../src/labels";
import { Typography, AppBar, Toolbar, IconButton, Button, Grid, Dialog, DialogContent, Table, TableCell, TableHead, TableBody, TableRow, DialogTitle } from "@material-ui/core";
import { ArrowBack } from '@material-ui/icons';
import Circle from '../../src/components/Circle';

export default function School({ n, data, normalized, meta }) {
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  return <>
    <Head>
      <title>{meta.name}</title>
    </Head>
    <AppBar position="static">
      <Toolbar>
        <IconButton color='inherit' onClick={() => Router.back()}>
          <ArrowBack />
        </IconButton>
        <Grid container justify='space-between' alignItems='center'>
          <Typography variant="h6" >
            {meta.name}
          </Typography>
          <Button color="inherit" onClick={() => setOpen(true)}>Барлығы</Button>
        </Grid>
      </Toolbar>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Көше/ША</TableCell>
                <TableCell>Оқушылар саны</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => <TableRow key={row.id}>
                <TableCell>{row.str}</TableCell>
                <TableCell>{row.qnt}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)}>
        <DialogTitle>{meta.name}</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Салынған  жылы</TableCell>
                <TableCell>{meta.buildAt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Жобалық қуаты</TableCell>
                <TableCell>{meta.estimated}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Оқушы  саны</TableCell>
                <TableCell>{meta.personNumb}</TableCell>
              </TableRow>
              {meta.miniCenter && <TableRow>
                <TableCell>шағын орталық</TableCell>
                <TableCell>{meta.miniCenter}</TableCell>
              </TableRow>}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </AppBar>
    <div style={{ position: "relative" }}>
      <img src={`../../images/${n}.png`} width="100%" />
      {Object.entries(Labels[n]).map(([key, styles]: any) => {
        const { str, qnt } = normalized[key];
        return (
          <Label key={key} {...styles}>
            <Typography style={{ fontSize: styles.fontSize, lineHeight: styles.lineHeight || 'initial' }}>
              {str} - {qnt}
            </Typography>
          </Label>
        );
      })}
      <Circle styles={Circles[n]} handleClick={() => setInfoOpen(true)} />
    </div>
  </>
}

export async function getStaticProps(context) {
  const n = context.params.n;
  const schoolsFile = xlsx.readFile('мектептер.xlsx')
  const schools = xlsx.utils.sheet_to_json(schoolsFile.Sheets['Лист1']);
  const normalizedSchools = schools.reduce((acc, curr: any) => {
    acc[curr.code] = curr;
    return acc;
  }, {})

  const xlsxData = xlsx.readFile(`data/${n}.xlsx`);
  const sh = xlsxData.Sheets["Лист1"];
  const data = xlsx.utils.sheet_to_json(sh);
  const normalized = data.reduce((acc, curr: any) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
  const personNumb = data.reduce<number>((acc, curr: any) => acc + Number(curr.qnt), 0);

  const meta = {
    name: normalizedSchools[n]['Атауы'] || null,
    buildAt: normalizedSchools[n]['Салынған  жылы'] || null,
    estimated: normalizedSchools[n]['Жобалык куаты'] || null,
    personNumb,
    miniCenter: normalizedSchools[n]['шағын орталық'] || null
  }
  return {
    props: { data, normalized, n: n, meta },
  };
}

export async function getStaticPaths() {
  const folder = fs.readdirSync("data");
  const paths = folder.map((filename) => ({
    params: { n: filename.split(".")[0] },
  }));
  return {
    paths,
    fallback: false,
  };
}
