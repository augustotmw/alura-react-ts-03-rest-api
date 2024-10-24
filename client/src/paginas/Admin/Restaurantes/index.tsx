import {useEffect, useState} from 'react';
import IRestaurante from '../../../interfaces/IRestaurante';
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import axios, {AxiosResponse} from 'axios';
import themeAdmin from '../Admin.module.scss';
import {Link, useNavigate} from 'react-router-dom';
import {IPaginacao} from '../../../interfaces/IPaginacao';



export default function AdminRestaurantes() {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [pagination, setPagination] = useState<{next:string|null, prev:string|null}>({next: null, prev: null});
  const navigate = useNavigate();

  const respRestaurantes = (resp: AxiosResponse<IPaginacao<IRestaurante>>) => {
    resp.data.results.length && setRestaurantes(resp.data.results);
    setPagination({ prev: resp.data.previous, next: resp.data.next });
  }

  useEffect(()=> {
    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')
      .then(respRestaurantes);
  }, []);

  const deleteItem = (id:number) => {
    axios.delete(`http://localhost:8000/api/v2/restaurantes/${id}/`)
      .then(()=>{
        console.log('Restaurante removido com sucesso!');
        alert('Restaurante removido com sucesso!');
        setRestaurantes(restaurantes.filter(restaurante => restaurante.id !== id));
      })
  }

  const editItem = (id:number) => {
    navigate(`/admin/restaurantes/${id}`);
  }

  const handleRestaurante = () => {
    navigate('/admin/restaurantes/add');
  }

  const prevPage = () => {
    console.log('prevPage', pagination.prev);
    if (pagination.prev) {
      axios.get<IPaginacao<IRestaurante>>(pagination.prev)
        .then(respRestaurantes);
    }
  }

  const nextPage = () => {
    console.log('nextPage', pagination.next);
    if (pagination.next) {
      axios.get<IPaginacao<IRestaurante>>(pagination.next)
        .then(respRestaurantes);
    }
  }

  return (
    <section className={themeAdmin.container}>
      <h1>Admin Restaurantes</h1>
      <Button variant={'outlined'} onClick={handleRestaurante}>Add</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Restaurante</TableCell>
              <TableCell align={'center'}>Editar</TableCell>
              <TableCell align={'center'}>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              restaurantes.map((restaurante) => (
                <TableRow key={restaurante.id}>
                  <TableCell>{restaurante.nome}</TableCell>
                  <TableCell align={'center'}>
                    <Button variant={'outlined'} color={'warning'}
                      onClick={()=> editItem(restaurante.id)}>&#128221;</Button>
                  </TableCell>
                  <TableCell align={'center'}>
                    <Button variant={'outlined'} color={'error'}
                            onClick={()=> deleteItem(restaurante.id)}>&#10060;</Button>
                  </TableCell>
                </TableRow>
              ))
            }
            <TableRow>
              <TableCell colSpan={2} className={themeAdmin.tableActions}>
                <Button variant={'outlined'} onClick={prevPage} disabled={!Boolean(pagination.prev)}>Prev</Button>
                <Button variant={'outlined'} onClick={nextPage} disabled={!Boolean(pagination.next)}>Next</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
