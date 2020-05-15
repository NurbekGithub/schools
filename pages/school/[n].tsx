import { useState } from 'react';
import Head from "next/head";
import Link from 'next/link';
import fs from "fs";
import xlsx from "xlsx";
import Label from "../../src/components/Label";
import { Labels } from "../../src/labels";
import { Typography, AppBar, Toolbar, IconButton, Button, Grid, Dialog, DialogContent, Table, TableCell, TableHead, TableBody, TableRow } from "@material-ui/core";
import { ArrowBack } from '@material-ui/icons';

export default function School({ n, data, normalized }) {
  const [open, setOpen] = useState(false);
  return <>
    <Head>
      <title>Мектеп №{n}</title>
    </Head>
    <AppBar position="static">
      <Toolbar>
        <Link href='/'>
          <a style={{ color: '#fff' }}>
            <IconButton color='inherit'>
              <ArrowBack />
            </IconButton>
          </a>
        </Link>
        <Grid container justify='space-between' alignItems='center'>
          <Typography variant="h6" >
            {n}
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
    </AppBar>
    <div style={{ position: "relative" }}>
      <img src={`/images/${n}.png`} width="100%" />
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
    </div>
  </>
}

export async function getStaticProps(context) {
  const xlsxData = xlsx.readFile(`data/${context.params.n}.xlsx`);
  const sh = xlsxData.Sheets["Лист1"];
  const data = xlsx.utils.sheet_to_json(sh);
  const normalized = data.reduce((acc, curr: any) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
  return {
    props: { data, normalized, n: context.params.n },
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
