class ClassificationFlowTask < FlowTask
  RDP_CLASSIFIER_PATH = TRICORDER_CONFIG[:rdp_jar_path]
  
  def to_param
    param = id.to_s
    if fasta_input = sequences_input
      param += "-#{fasta_input.file_file_name}"
    end
  end
  
  def run
    raise "No FASTA file included!" unless sequences_input
    
    rdp_outpath = File.join File.dirname(Tempfile.new('foo').path), "#{sequences_input.file_file_name}.rdp.tab"
    
    # run rdp classifier fasta
    run_command "java -Xmx1g -jar #{RDP_CLASSIFIER_PATH} -q #{sequences_input.file.path} -o #{rdp_outpath}"
    
    # create an output for the rdp results
    self.outputs.create(:file => open(rdp_outpath))
    
    # massage rdp results into json
    open(rdp_outpath.sub(/tab$/, 'json'), 'w+') do |rdp_json_file|
      rdp_json_file.write(rdp_to_json(rdp_outpath))
      self.outputs.create(:file => rdp_json_file)
    end
  end
  
  def rdp_to_json(path)
    tree = {}
    FasterCSV.foreach(path, :col_sep => "\t") do |line|
      parent = tree
      lineage = {}
      line[2..-1].each_slice(3) do |level|
        parent[:children] ||= []
        name, rank, confidence = level
        lineage[rank] = name
        if existing = parent[:children].detect{|n| n[:name] == name}
          existing[:count] += 1
          existing[:samples] << line[0]
          parent = existing
          next
        end
        parent[:children] << {
          :name => name, 
          :rank => rank, 
          :confidence => confidence, 
          :lineage => lineage, 
          :count => 1,
          :samples => [line[0]]
        }
        parent = parent[:children].last
      end
    end
    tree[:children].first.to_json
  end
  
  def sequences_input
    inputs.detect{|i| i.file_file_name =~ /.fasta/ || i.extra == "sequences"}
  end
  
  def abundances_input
    inputs.detect{|i| i.id != sequences_input.try(:id).to_i }
  end
  
  def rdp_output
    outputs.detect{|i| i.file_file_name =~ /.rdp.json/}
  end
  
end
