import Head from "next/head";
import { AppBar, Toolbar, Button, Grid, Typography, Container, TableCell, Table, TableHead, TableRow, TableBody, Paper } from "@material-ui/core";
import Link from "next/link";
import xlsx from 'xlsx';
import fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';

export default function Home({ data }) {
  return (
    <>
      <Head>
        <title>Орал мектептері</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Typography variant="h6">Орал мектептері</Typography>
          </Grid>
        </Toolbar>
      </AppBar>
      <br />
      <Container component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Мектеп</TableCell>
              <TableCell>Көшелер саны</TableCell>
              <TableCell>Оқушылар саны</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => <TableRow key={row.n}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.strNumb}</TableCell>
              <TableCell>{row.personNumb}</TableCell>
              <TableCell>
                {isDev
                  ? <Link href={`school/[n]`} as={`school/${row.n}`}>
                    <a style={{ textDecoration: 'none' }}>
                      <Button variant='contained' color='primary'>Толығырақ</Button>
                    </a>
                  </Link>
                  : <a style={{ textDecoration: 'none' }} href={`school/${row.n}`}>
                    <Button variant='contained' color='primary'>Толығырақ</Button>
                  </a>
                }
              </TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const schoolsFile = xlsx.readFile('мектептер.xlsx')
  const schools = xlsx.utils.sheet_to_json(schoolsFile.Sheets['Лист1']);
  const normalizedSchools = schools.reduce((acc, curr: any) => {
    acc[curr.code] = curr;
    return acc;
  }, {})

  const folder = fs.readdirSync("data");
  const data = folder.sort((a: string, b: string) => {
    const an = +a.split(".")[0] || 999;
    const bn = +b.split(".")[0] || 999;
    return an > bn ? 1 : -1;
  }).map(filename => {
    const n = filename.split(".")[0];
    const xlsxData = xlsx.readFile(`data/${n}.xlsx`);
    const sh = xlsxData.Sheets["Лист1"];
    const sheetData = xlsx.utils.sheet_to_json(sh);
    const strNumb = sheetData.length;
    const personNumb = sheetData.reduce<number>((acc, curr: any) => acc + Number(curr.qnt), 0);

    return { n, name: normalizedSchools[n]['Атауы'], strNumb, personNumb }
  });
  return {
    props: { data },
  };
}