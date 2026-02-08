export type CourseDetailType = {
  course: string
  imageSrc: string
  profession: string
  price: string
  category:
    | 'iso-management'
    | 'securite-information'
    | 'conformite-reglementaire'
    | 'gestion-risques'
}
