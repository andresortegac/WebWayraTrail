import { useEffect, useState } from 'react';
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Search,
  Trash2,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { inscriptionService } from '@/services/api';
import type { CategoryInfo, Inscription, Stats } from '@/types';

const EVENT_TITLE = 'WAYRA TRAIL';
const EVENT_SUBTITLE = 'Ruta de Guerreros Ancestrales 16K';
const EXCEL_EXPORT_MIME = 'application/vnd.ms-excel;charset=utf-8;';
const EXCEL_SHEET_NAME_MAX_LENGTH = 31;
const CATEGORY_EXPORT_ORDER = ['Recreativa', 'Libre', 'A', 'B', 'C'];
const EXCEL_COLUMN_WIDTHS = [48, 110, 110, 90, 200, 95, 55, 75, 95, 70, 145, 105, 120];

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getReadableTextColor = (hexColor: string) => {
  const normalized = hexColor.replace('#', '');

  if (normalized.length !== 6) {
    return '#FFFFFF';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  if ([red, green, blue].some(Number.isNaN)) {
    return '#FFFFFF';
  }

  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.65 ? '#1F2937' : '#FFFFFF';
};

const getWorksheetName = (name: string, fallback: string) => {
  const sanitizedName = name.replace(/[:\\/?*\[\]]/g, ' ').trim();
  return (sanitizedName || fallback).slice(0, EXCEL_SHEET_NAME_MAX_LENGTH);
};

const getCategoryOrderIndex = (category: string) => {
  const index = CATEGORY_EXPORT_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_EXPORT_ORDER.length : index;
};

const getCategoryClass = (category: string) => {
  switch (category) {
    case 'Recreativa':
      return 'bg-red-100 text-red-700';
    case 'Libre':
      return 'bg-amber-100 text-amber-800';
    case 'A':
      return 'bg-emerald-100 text-emerald-700';
    case 'B':
      return 'bg-sky-100 text-sky-700';
    case 'C':
      return 'bg-violet-100 text-violet-700';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Recreativa':
      return '#EF4444';
    case 'Libre':
      return '#FCD34D';
    case 'A':
      return '#10B981';
    case 'B':
      return '#3B82F6';
    case 'C':
      return '#8B5CF6';
    default:
      return '#9CA3AF';
  }
};

export function AdminInscriptionsPanel() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, hombres: 0, mujeres: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [inscriptionToDelete, setInscriptionToDelete] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    try {
      const [inscriptionsData, categoriesData, statsData] = await Promise.all([
        inscriptionService.getAll(),
        inscriptionService.getByCategory(),
        inscriptionService.getStats(),
      ]);

      setInscriptions(inscriptionsData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading inscriptions panel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await inscriptionService.delete(id);
      await loadData();
      setShowDeleteDialog(false);
      setInscriptionToDelete(null);
    } catch (error) {
      console.error('Error deleting inscription:', error);
    }
  };

  const filteredInscriptions = inscriptions.filter((inscription) => {
    const matchesSearch =
      inscription.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.cedula.includes(searchTerm) ||
      inscription.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || inscription.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedByCategory = filteredInscriptions.reduce((acc, inscription) => {
    if (!acc[inscription.categoria]) {
      acc[inscription.categoria] = [];
    }

    acc[inscription.categoria].push(inscription);
    return acc;
  }, {} as Record<string, Inscription[]>);

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'all';

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const exportToExcelFile = () => {
    const createdAt = new Date();
    const headers = [
      'ID',
      'Nombres',
      'Apellidos',
      'Cedula',
      'Email',
      'Telefono',
      'Edad',
      'Genero',
      'Categoria',
      'Talla',
      'Contacto Emergencia',
      'Tel. Emergencia',
      'Fecha Inscripcion',
    ];

    const groupedForExport = filteredInscriptions.reduce((acc, inscription) => {
      if (!acc[inscription.categoria]) {
        acc[inscription.categoria] = [];
      }

      acc[inscription.categoria].push(inscription);
      return acc;
    }, {} as Record<string, Inscription[]>);

    const sortedCategories = Object.keys(groupedForExport).sort((left, right) => {
      const orderDifference = getCategoryOrderIndex(left) - getCategoryOrderIndex(right);
      return orderDifference !== 0 ? orderDifference : left.localeCompare(right, 'es-CO');
    });

    const categoryStyles = new Map(
      sortedCategories.map((category, index) => {
        const categoryColor =
          groupedForExport[category].find((inscription) => inscription.color_categoria)?.color_categoria ||
          getCategoryColor(category);

        return [
          category,
          {
            rowStyleId: `CategoryRow${index + 1}`,
            categoryCellStyleId: `CategoryCell${index + 1}`,
            color: categoryColor,
            textColor: getReadableTextColor(categoryColor),
          },
        ];
      })
    );

    const buildCellXml = (value: unknown, styleId: string) => `
      <Cell ss:StyleID="${styleId}">
        <Data ss:Type="String">${escapeHtml(value)}</Data>
      </Cell>
    `;

    const buildWorksheetXml = (sheetName: string, subtitle: string, inscriptionsToExport: Inscription[]) => `
      <Worksheet ss:Name="${escapeHtml(getWorksheetName(sheetName, 'Hoja'))}">
        <Table>
          ${EXCEL_COLUMN_WIDTHS.map((width) => `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`).join('')}
          <Row ss:AutoFitHeight="0" ss:Height="24">
            <Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="EventTitle">
              <Data ss:Type="String">${escapeHtml(EVENT_TITLE)}</Data>
            </Cell>
          </Row>
          <Row ss:AutoFitHeight="0" ss:Height="20">
            <Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="EventSubtitle">
              <Data ss:Type="String">${escapeHtml(subtitle)}</Data>
            </Cell>
          </Row>
          <Row ss:AutoFitHeight="0" ss:Height="18">
            <Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="EventMeta">
              <Data ss:Type="String">${escapeHtml(`Exportado el ${createdAt.toLocaleString('es-CO')} | Total registros: ${inscriptionsToExport.length}`)}</Data>
            </Cell>
          </Row>
          <Row>${headers.map((header) => buildCellXml(header, 'Header')).join('')}</Row>
          ${inscriptionsToExport
            .map((inscription) => {
              const style = categoryStyles.get(inscription.categoria);
              const rowStyleId = style?.rowStyleId || 'Default';
              const categoryCellStyleId = style?.categoryCellStyleId || rowStyleId;

              return `
                <Row>
                  ${buildCellXml(inscription.id, rowStyleId)}
                  ${buildCellXml(inscription.nombres, rowStyleId)}
                  ${buildCellXml(inscription.apellidos, rowStyleId)}
                  ${buildCellXml(inscription.cedula, rowStyleId)}
                  ${buildCellXml(inscription.email, rowStyleId)}
                  ${buildCellXml(inscription.telefono, rowStyleId)}
                  ${buildCellXml(inscription.edad, rowStyleId)}
                  ${buildCellXml(inscription.genero === 'M' ? 'Hombre' : 'Mujer', rowStyleId)}
                  ${buildCellXml(inscription.categoria, categoryCellStyleId)}
                  ${buildCellXml(inscription.talla_camiseta, rowStyleId)}
                  ${buildCellXml(inscription.contacto_emergencia, rowStyleId)}
                  ${buildCellXml(inscription.telefono_emergencia, rowStyleId)}
                  ${buildCellXml(inscription.fecha_inscripcion, rowStyleId)}
                </Row>
              `;
            })
            .join('')}
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <DisplayGridlines />
        </WorksheetOptions>
      </Worksheet>
    `;

    const categoryStyleXml = sortedCategories
      .map((category) => {
        const style = categoryStyles.get(category);

        if (!style) {
          return '';
        }

        return `
          <Style ss:ID="${style.rowStyleId}">
            <Alignment ss:Vertical="Center" ss:WrapText="1" />
            <Borders>
              <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
            </Borders>
            <Font ss:FontName="Arial" ss:Size="10" ss:Color="${style.textColor}" />
            <Interior ss:Color="${style.color}" ss:Pattern="Solid" />
          </Style>
          <Style ss:ID="${style.categoryCellStyleId}">
            <Alignment ss:Vertical="Center" ss:WrapText="1" />
            <Borders>
              <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
            </Borders>
            <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="${style.textColor}" />
            <Interior ss:Color="${style.color}" ss:Pattern="Solid" />
          </Style>
        `;
      })
      .join('');

    const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
      <?mso-application progid="Excel.Sheet"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">
        <Styles>
          <Style ss:ID="Default" ss:Name="Normal">
            <Alignment ss:Vertical="Center" ss:WrapText="1" />
            <Borders>
              <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
              <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB" />
            </Borders>
            <Font ss:FontName="Arial" ss:Size="10" ss:Color="#111827" />
          </Style>
          <Style ss:ID="Header">
            <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1" />
            <Borders>
              <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D" />
              <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D" />
              <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D" />
              <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D" />
            </Borders>
            <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF" />
            <Interior ss:Color="#166534" ss:Pattern="Solid" />
          </Style>
          <Style ss:ID="EventTitle">
            <Alignment ss:Horizontal="Center" ss:Vertical="Center" />
            <Font ss:FontName="Arial" ss:Size="16" ss:Bold="1" ss:Color="#166534" />
            <Interior ss:Color="#DCFCE7" ss:Pattern="Solid" />
          </Style>
          <Style ss:ID="EventSubtitle">
            <Alignment ss:Horizontal="Center" ss:Vertical="Center" />
            <Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#15803D" />
            <Interior ss:Color="#F0FDF4" ss:Pattern="Solid" />
          </Style>
          <Style ss:ID="EventMeta">
            <Alignment ss:Horizontal="Center" ss:Vertical="Center" />
            <Font ss:FontName="Arial" ss:Size="10" ss:Color="#4B5563" />
            <Interior ss:Color="#F9FAFB" ss:Pattern="Solid" />
          </Style>
          ${categoryStyleXml}
        </Styles>
        ${buildWorksheetXml('Inscripciones', EVENT_SUBTITLE, filteredInscriptions)}
        ${sortedCategories
          .map((category) =>
            buildWorksheetXml(category, `${EVENT_SUBTITLE} - Categoria ${category}`, groupedForExport[category])
          )
          .join('')}
      </Workbook>
    `;

    const blob = new Blob(['\ufeff', workbookXml], { type: EXCEL_EXPORT_MIME });
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);

    link.href = objectUrl;
    link.download = `wayra_trail_ruta_de_guerreros_ancestrales_16k_inscripciones_${createdAt.toISOString().split('T')[0]}.xls`;
    link.click();

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  };

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-[#d7e6db] bg-white p-10 shadow-[0_30px_80px_-55px_rgba(21,53,42,0.55)]">
        <div className="flex items-center gap-3 text-[#15352a]">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#15352a]/25 border-t-[#15352a]" />
          <div>
            <p className="font-semibold">Cargando inscripciones</p>
            <p className="text-sm text-[#587062]">Traemos registros, categorias y estadisticas del evento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-[#d7e6db] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5b7368]">Total inscritos</p>
                <p className="mt-2 text-3xl font-black text-[#12231b]">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#d7e6db] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5b7368]">Hombres</p>
                <p className="mt-2 text-3xl font-black text-sky-700">{stats.hombres}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#d7e6db] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5b7368]">Mujeres</p>
                <p className="mt-2 text-3xl font-black text-pink-700">{stats.mujeres}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#d7e6db] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#12231b]">
            <BarChart3 className="h-5 w-5 text-[#15352a]" />
            Distribucion por categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.map((category) => (
              <div
                key={category.categoria}
                className="rounded-[1.5rem] p-4 text-center"
                style={{ backgroundColor: `${category.color_categoria}18` }}
              >
                <div
                  className="mx-auto mb-3 h-9 w-9 rounded-xl"
                  style={{ backgroundColor: category.color_categoria }}
                />
                <p className="font-bold text-[#12231b]">{category.categoria}</p>
                <p className="mt-2 text-2xl font-black" style={{ color: category.color_categoria }}>
                  {category.total}
                </p>
                <p className="text-xs text-[#5b7368]">
                  {category.hombres}H / {category.mujeres}M
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#d7e6db] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-[#12231b]">
              <Trophy className="h-5 w-5 text-[#15352a]" />
              Inscripciones WAYRA TRAIL 16K
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => void loadData()} className="border-[#d2dfd5]">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
              <Button onClick={exportToExcelFile} className="bg-[#15352a] hover:bg-[#0f241d]">
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#89a095]" />
              <Input
                placeholder="Buscar por nombre, cedula o email..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-xl border border-[#d2dfd5] bg-white px-4 py-2 text-sm text-[#183127] focus:outline-none focus:ring-2 focus:ring-[#15352a]/20"
            >
              <option value="all">Todas las categorias</option>
              <option value="Recreativa">Recreativa</option>
              <option value="Libre">Libre</option>
              <option value="A">Categoria A</option>
              <option value="B">Categoria B</option>
              <option value="C">Categoria C</option>
            </select>

            <Button
              type="button"
              variant="outline"
              disabled={!hasActiveFilters}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Limpiar filtro
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category} className="overflow-hidden rounded-[1.5rem] border border-[#dfe8e2]">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between bg-[#f7faf7] px-4 py-4 text-left transition hover:bg-[#f0f6f1]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-lg" style={{ backgroundColor: getCategoryColor(category) }} />
                    <span className="font-bold text-[#12231b]">{category}</span>
                    <Badge variant="secondary" className={getCategoryClass(category)}>
                      {items.length} inscritos
                    </Badge>
                  </div>
                  {expandedCategories[category] ? (
                    <ChevronUp className="h-5 w-5 text-[#5b7368]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#5b7368]" />
                  )}
                </button>

                {(expandedCategories[category] || Object.keys(groupedByCategory).length === 1) && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px]">
                      <thead className="bg-[#f8faf8]">
                        <tr>
                          {['ID', 'Nombres', 'Apellidos', 'Cedula', 'Edad', 'Genero', 'Talla', 'Contacto', 'Acciones'].map((header) => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#5d7368]">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edf2ee]">
                        {items.map((inscription) => (
                          <tr
                            key={inscription.id}
                            className="hover:bg-[#fafcf9]"
                            style={{ backgroundColor: `${inscription.color_categoria}10` }}
                          >
                            <td className="px-4 py-3 text-sm text-[#183127]">{inscription.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-[#12231b]">{inscription.nombres}</td>
                            <td className="px-4 py-3 text-sm text-[#183127]">{inscription.apellidos}</td>
                            <td className="px-4 py-3 text-sm text-[#183127]">{inscription.cedula}</td>
                            <td className="px-4 py-3 text-sm text-[#183127]">{inscription.edad}</td>
                            <td className="px-4 py-3 text-sm text-[#183127]">
                              <Badge className={inscription.genero === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-sky-100 text-sky-700'}>
                                {inscription.genero === 'M' ? 'Hombre' : 'Mujer'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#183127]">{inscription.talla_camiseta}</td>
                            <td className="px-4 py-3 text-sm text-[#183127]">
                              <div>
                                <p>{inscription.contacto_emergencia}</p>
                                <p className="text-xs text-[#6f8579]">{inscription.telefono_emergencia}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setInscriptionToDelete(inscription.id);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}

            {filteredInscriptions.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-[#c8d9ce] bg-[#fafcf9] px-6 py-14 text-center">
                <Users className="mx-auto h-12 w-12 text-[#b3c5ba]" />
                <p className="mt-4 font-semibold text-[#183127]">No se encontraron inscripciones</p>
                <p className="mt-2 text-sm text-[#6f8579]">Prueba con otro termino o limpia los filtros activos.</p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminacion</DialogTitle>
            <DialogDescription>
              Esta accion eliminara la inscripcion seleccionada y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => (inscriptionToDelete ? void handleDelete(inscriptionToDelete) : undefined)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
