'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Servicio {
  cantidad: number;
  descripcion: string;
  precio: number;
  descuento: number;
}

interface FacturaData {
  numero: string;
  fecha: string;
  preciosConIVA: boolean;
  concepto: string;
  iva: number;
  irpf: number;
  tipoPago: string;
  estado: string;
  linkTransaccion: string;
  emisor: {
    nombre: string;
    nif: string;
    direccion: string;
    telefono: string;
    email: string;
  };
  cliente: {
    nombre: string;
    nif: string;
    direccion: string;
    telefono: string;
    email: string;
  };
  servicios: Servicio[];
}

export default function GeneradorFacturaPage() {
  const [factura, setFactura] = useState<FacturaData>({
    numero: 'F2026-00001',
    fecha: new Date().toISOString().substring(0, 10),
    preciosConIVA: true,
    concepto: '',
    iva: 21,
    irpf: 0,
    tipoPago: '',
    estado: '',
    linkTransaccion: '',
    emisor: {
      nombre: 'MARCANO GONZALEZ JOHANA PATRICIA',
      nif: '78829397W',
      direccion: 'Calle Modesto Lafuente 5, 1, 28010 Madrid',
      telefono: '+34623069569',
      email: 'dra.johanam@gmail.com',
    },
    cliente: {
      nombre: '',
      nif: '',
      direccion: '',
      telefono: '',
      email: '',
    },
    servicios: [{ cantidad: 1, descripcion: '', precio: 0, descuento: 0 }],
  });

  const updateField = (field: string, value: any) => {
    setFactura({ ...factura, [field]: value });
  };

  const updateEmisor = (field: string, value: string) => {
    setFactura({
      ...factura,
      emisor: { ...factura.emisor, [field]: value },
    });
  };

  const updateCliente = (field: string, value: string) => {
    setFactura({
      ...factura,
      cliente: { ...factura.cliente, [field]: value },
    });
  };

  const updateServicio = (index: number, field: keyof Servicio, value: any) => {
    const servicios = [...factura.servicios];
    servicios[index] = { ...servicios[index], [field]: value };
    setFactura({ ...factura, servicios });
  };

  const agregarServicio = () => {
    setFactura({
      ...factura,
      servicios: [
        ...factura.servicios,
        { cantidad: 1, descripcion: '', precio: 0, descuento: 0 },
      ],
    });
  };

  const eliminarServicio = (index: number) => {
    const servicios = factura.servicios.filter((_, i) => i !== index);
    setFactura({ ...factura, servicios });
  };

  // Cálculos
  const baseImponible = factura.servicios.reduce(
    (sum, s) =>
      sum +
      s.cantidad * (s.precio - (s.precio * s.descuento) / 100),
    0
  );

  const totalSinIVA = factura.preciosConIVA
    ? baseImponible / (1 + factura.iva / 100)
    : baseImponible;

  const totalIVA = factura.preciosConIVA
    ? baseImponible - totalSinIVA
    : baseImponible * (factura.iva / 100);

  const totalIRPF = (totalSinIVA * factura.irpf) / 100;

  const total = factura.preciosConIVA
    ? baseImponible - totalIRPF
    : baseImponible + totalIVA - totalIRPF;

  const generarPDF = async () => {
    const elemento = document.getElementById('factura-preview');
    if (!elemento) {
      toast.error('No se puede generar el PDF');
      return;
    }

    try {
      const canvas = await html2canvas(elemento, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
      pdf.save(`${factura.numero || 'factura'}.pdf`);
      toast.success('PDF generado correctamente');
    } catch (error) {
      toast.error('Error al generar PDF');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generador de Facturas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="space-y-6">
          {/* Datos de la factura */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de la Factura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número de factura</Label>
                  <Input
                    value={factura.numero}
                    onChange={(e) => updateField('numero', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={factura.fecha}
                    onChange={(e) => updateField('fecha', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preciosConIVA"
                  checked={factura.preciosConIVA}
                  onCheckedChange={(checked) =>
                    updateField('preciosConIVA', !!checked)
                  }
                />
                <Label htmlFor="preciosConIVA" className="cursor-pointer">
                  ¿Precios con IVA incluido?
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Concepto general</Label>
                <Input
                  value={factura.concepto}
                  onChange={(e) => updateField('concepto', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>IVA (%)</Label>
                  <Input
                    type="number"
                    value={factura.iva}
                    onChange={(e) =>
                      updateField('iva', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>IRPF (%)</Label>
                  <Input
                    type="number"
                    value={factura.irpf}
                    onChange={(e) =>
                      updateField('irpf', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Pago</Label>
                  <Select
                    value={factura.tipoPago}
                    onValueChange={(value) => updateField('tipoPago', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Tarjeta de Crédito/Débito">
                        Tarjeta
                      </SelectItem>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="Bizum">Bizum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={factura.estado}
                    onValueChange={(value) => updateField('estado', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente de pago">Pendiente</SelectItem>
                      <SelectItem value="Pagada">Pagada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Link de Transacción (Opcional)</Label>
                <Input
                  value={factura.linkTransaccion}
                  onChange={(e) => updateField('linkTransaccion', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Datos del Emisor */}
          <Card>
            <CardHeader>
              <CardTitle>Datos del Emisor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={factura.emisor.nombre}
                  onChange={(e) => updateEmisor('nombre', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NIF</Label>
                  <Input
                    value={factura.emisor.nif}
                    onChange={(e) => updateEmisor('nif', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={factura.emisor.telefono}
                    onChange={(e) => updateEmisor('telefono', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input
                  value={factura.emisor.direccion}
                  onChange={(e) => updateEmisor('direccion', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={factura.emisor.email}
                  onChange={(e) => updateEmisor('email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Datos del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={factura.cliente.nombre}
                  onChange={(e) => updateCliente('nombre', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NIF</Label>
                  <Input
                    value={factura.cliente.nif}
                    onChange={(e) => updateCliente('nif', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={factura.cliente.telefono}
                    onChange={(e) => updateCliente('telefono', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input
                  value={factura.cliente.direccion}
                  onChange={(e) => updateCliente('direccion', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={factura.cliente.email}
                  onChange={(e) => updateCliente('email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Servicios</CardTitle>
                <Button onClick={agregarServicio} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {factura.servicios.map((servicio, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-semibold">
                        Servicio {index + 1}
                      </Label>
                      {factura.servicios.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarServicio(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input
                        value={servicio.descripcion}
                        onChange={(e) =>
                          updateServicio(index, 'descripcion', e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          value={servicio.cantidad}
                          onChange={(e) =>
                            updateServicio(
                              index,
                              'cantidad',
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Precio</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={servicio.precio}
                          onChange={(e) =>
                            updateServicio(
                              index,
                              'precio',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descuento %</Label>
                        <Input
                          type="number"
                          value={servicio.descuento}
                          onChange={(e) =>
                            updateServicio(
                              index,
                              'descuento',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      Subtotal: €
                      {(
                        servicio.cantidad *
                        (servicio.precio -
                          (servicio.precio * servicio.descuento) / 100)
                      ).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Vista previa */}
        <div className="lg:sticky lg:top-4 h-fit">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vista Previa</CardTitle>
              <Button onClick={generarPDF}>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div
                id="factura-preview"
                className="border p-6 bg-white text-black space-y-4"
                style={{ minHeight: '800px' }}
              >
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">FACTURA</h2>
                  <p className="text-lg">{factura.numero}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-bold mb-2">EMISOR</h3>
                    <p className="font-semibold">{factura.emisor.nombre}</p>
                    <p>NIF: {factura.emisor.nif}</p>
                    <p>{factura.emisor.direccion}</p>
                    <p>{factura.emisor.telefono}</p>
                    <p>{factura.emisor.email}</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">CLIENTE</h3>
                    <p className="font-semibold">{factura.cliente.nombre}</p>
                    <p>NIF: {factura.cliente.nif}</p>
                    <p>{factura.cliente.direccion}</p>
                    <p>{factura.cliente.telefono}</p>
                    <p>{factura.cliente.email}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p>
                    <strong>Fecha:</strong> {factura.fecha}
                  </p>
                  {factura.concepto && (
                    <p>
                      <strong>Concepto:</strong> {factura.concepto}
                    </p>
                  )}
                </div>

                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left p-2">Descripción</th>
                      <th className="text-right p-2">Cant.</th>
                      <th className="text-right p-2">Precio</th>
                      <th className="text-right p-2">Desc.</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factura.servicios.map((servicio, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{servicio.descripcion}</td>
                        <td className="text-right p-2">{servicio.cantidad}</td>
                        <td className="text-right p-2">
                          €{servicio.precio.toFixed(2)}
                        </td>
                        <td className="text-right p-2">{servicio.descuento}%</td>
                        <td className="text-right p-2">
                          €
                          {(
                            servicio.cantidad *
                            (servicio.precio -
                              (servicio.precio * servicio.descuento) / 100)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="ml-auto w-64 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Imponible:</span>
                    <span>€{totalSinIVA.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA ({factura.iva}%):</span>
                    <span>€{totalIVA.toFixed(2)}</span>
                  </div>
                  {factura.irpf > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>IRPF ({factura.irpf}%):</span>
                      <span>-€{totalIRPF.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>TOTAL:</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                {factura.tipoPago && (
                  <div className="text-sm">
                    <p>
                      <strong>Forma de pago:</strong> {factura.tipoPago}
                    </p>
                  </div>
                )}

                {factura.estado && (
                  <div className="text-sm">
                    <p>
                      <strong>Estado:</strong> {factura.estado}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
